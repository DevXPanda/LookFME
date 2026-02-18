const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");
const User = require("../model/User");
const RefundRequest = require("../model/RefundRequest");

/**
 * Helper function to create a RefundRequest when order is canceled or returned
 * Only creates if payment method is not COD and no duplicate exists
 */
async function createRefundRequestIfNeeded(order, reason) {
  try {
    // Check if payment method is COD (case-insensitive)
    const paymentMethod = order.paymentMethod?.toLowerCase();
    if (paymentMethod === "cod" || paymentMethod === "cash on delivery") {
      return; // Skip refund request for COD orders
    }

    // Check if refund request already exists for this order
    const existingRefund = await RefundRequest.findOne({ orderId: order._id });
    if (existingRefund) {
      return; // Prevent duplicate refund requests
    }

    // Create refund request
    await RefundRequest.create({
      orderId: order._id,
      userId: order.user,
      reason: reason || "Order canceled/returned",
      status: "pending",
      refundAmount: order.totalAmount || 0,
    });
  } catch (error) {
    // Log error but don't throw - refund request creation shouldn't block order status update
    console.error("Error creating refund request:", error);
  }
}

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderItems = await Order.create(req.body);
    const userId = req.body.user;
    if (userId) {
      await User.findByIdAndUpdate(userId, { $inc: { totalOrders: 1 } });
    }
    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  let newStatus = req.body.status;
  if (typeof newStatus === 'string') {
    const normalized = newStatus.toLowerCase();
    if (normalized === 'exchanging' || normalized === 'preparing-for-exchanging') {
      newStatus = 'exchanged';
    }
  }
  try {
    // Get order before update to check if status is changing to cancel/return
    const orderBeforeUpdate = await Order.findById(req.params.id);
    
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      }, { new: true });

    // Check if status changed to cancel or return_requested/returned
    const normalizedNewStatus = typeof newStatus === 'string' ? newStatus.toLowerCase() : '';
    if (orderBeforeUpdate && (normalizedNewStatus === 'cancel' || normalizedNewStatus === 'return_requested' || normalizedNewStatus === 'returned')) {
      // Create refund request if payment method is not COD
      await createRefundRequestIfNeeded(orderBeforeUpdate, `Order status changed to ${newStatus}`);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

// update order address (only before delivery)
exports.updateOrderAddress = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow address change if order is not delivered
    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change address for delivered orders',
      });
    }

    const { address, city, country, zipCode, contact } = req.body;

    // Save old address to history
    const oldAddress = {
      address: order.address,
      city: order.city,
      country: order.country,
      zipCode: order.zipCode,
      contact: order.contact,
    };

    const newAddress = {
      address: address || order.address,
      city: city || order.city,
      country: country || order.country,
      zipCode: zipCode || order.zipCode,
      contact: contact || order.contact,
    };

    // Update order with new address
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          address: newAddress.address,
          city: newAddress.city,
          country: newAddress.country,
          zipCode: newAddress.zipCode,
          contact: newAddress.contact,
        },
        $push: {
          addressChangeHistory: {
            oldAddress,
            newAddress,
            changedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// cancel order with reason
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow cancellation if order is not delivered
    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered orders',
      });
    }

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Cancel reason is required',
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: 'cancel',
          cancelReason: reason,
        },
      },
      { new: true }
    );

    // Create refund request if payment method is not COD
    await createRefundRequestIfNeeded(order, reason || "Order canceled by user");

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// return or exchange order (item-level)
exports.returnOrExchangeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow return/exchange for delivered orders
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only return/exchange delivered orders',
      });
    }

    const { type, items, reason } = req.body;

    if (!type || !['returned', 'exchanged'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "returned" or "exchanged"',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required',
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required',
      });
    }

    const updateData = {};

    if (type === 'returned') {
      // Process return items
      const returnItems = items.map(item => ({
        productId: item.productId,
        productTitle: item.productTitle,
        quantity: item.quantity,
        price: item.price,
        reason: reason,
        status: 'pending',
        refundAmount: item.price * item.quantity,
        refundStatus: 'pending',
      }));

      updateData.$push = { returnItems: { $each: returnItems } };
      updateData.returnReason = reason;

      // Update order status to 'returned' when a return request is submitted
      updateData.status = 'returned';
    } else if (type === 'exchanged') {
      // Process exchange items
      const exchangeItems = items.map(item => ({
        originalProductId: item.originalProductId,
        originalProductTitle: item.originalProductTitle,
        originalQuantity: item.originalQuantity,
        originalPrice: item.originalPrice,
        exchangeProductId: item.exchangeProductId,
        exchangeProductTitle: item.exchangeProductTitle,
        exchangeQuantity: item.exchangeQuantity,
        exchangePrice: item.exchangePrice,
        reason: reason,
        status: 'pending',
        priceDifference: (item.exchangePrice * item.exchangeQuantity) - (item.originalPrice * item.originalQuantity),
      }));

      updateData.$push = { exchangeItems: { $each: exchangeItems } };
      updateData.exchangeReason = reason;
      // Update order status to 'exchanged' when an exchange request is submitted
      updateData.status = 'exchanged';
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Create refund request if order is returned and payment method is not COD
    if (type === 'returned') {
      await createRefundRequestIfNeeded(order, reason || "Order returned by user");
    }

    res.status(200).json({
      success: true,
      message: `${type === 'returned' ? 'Return' : 'Exchange'} request submitted successfully`,
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// process refund for returned items
exports.processRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const { returnItemIndex, approve } = req.body;

    if (returnItemIndex === undefined || !order.returnItems || !order.returnItems[returnItemIndex]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid return item index',
      });
    }

    const returnItem = order.returnItems[returnItemIndex];

    if (approve) {
      // Process refund based on payment method
      let refundTransactionId = null;
      let refundStatus = 'processing';

      if (order.paymentMethod === 'Card' && order.paymentIntent?.id) {
        try {
          // Process Stripe refund
          const refund = await stripe.refunds.create({
            payment_intent: order.paymentIntent.id,
            amount: Math.round(returnItem.refundAmount * 100), // Convert to cents
            reason: 'requested_by_customer',
          });
          refundTransactionId = refund.id;
          refundStatus = refund.status === 'succeeded' ? 'completed' : 'processing';
        } catch (stripeError) {
          console.error('Stripe refund error:', stripeError);
          refundStatus = 'failed';
        }
      } else if (order.paymentMethod === 'COD') {
        // For COD, mark as completed (manual refund process)
        refundStatus = 'completed';
        refundTransactionId = `COD-REFUND-${Date.now()}`;
      }

      // Update return item
      order.returnItems[returnItemIndex].status = 'approved';
      order.returnItems[returnItemIndex].refundStatus = refundStatus;
      order.returnItems[returnItemIndex].refundTransactionId = refundTransactionId;

      // Add to refund history
      order.refundHistory.push({
        amount: returnItem.refundAmount,
        type: 'partial',
        paymentMethod: order.paymentMethod,
        status: refundStatus,
        transactionId: refundTransactionId,
        reason: returnItem.reason,
        processedAt: new Date(),
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        order: order,
      });
    } else {
      // Reject return
      order.returnItems[returnItemIndex].status = 'rejected';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Return request rejected',
        order: order,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// process exchange
exports.processExchange = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const { exchangeItemIndex, approve } = req.body;

    if (exchangeItemIndex === undefined || !order.exchangeItems || !order.exchangeItems[exchangeItemIndex]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exchange item index',
      });
    }

    const exchangeItem = order.exchangeItems[exchangeItemIndex];

    if (approve) {
      // Process exchange
      exchangeItem.status = 'approved';
      // Update order status to 'exchanged' when an exchange is approved
      order.status = 'exchanged';

      // Handle price difference
      if (exchangeItem.priceDifference > 0) {
        // Customer needs to pay more
        // This would typically create a new payment intent or order
        exchangeItem.status = 'awaiting_payment';
      } else if (exchangeItem.priceDifference < 0) {
        // Refund the difference
        const refundAmount = Math.abs(exchangeItem.priceDifference);
        let refundTransactionId = null;
        let refundStatus = 'processing';

        if (order.paymentMethod === 'Card' && order.paymentIntent?.id) {
          try {
            const refund = await stripe.refunds.create({
              payment_intent: order.paymentIntent.id,
              amount: Math.round(refundAmount * 100),
              reason: 'requested_by_customer',
            });
            refundTransactionId = refund.id;
            refundStatus = refund.status === 'succeeded' ? 'completed' : 'processing';
          } catch (stripeError) {
            console.error('Stripe refund error:', stripeError);
            refundStatus = 'failed';
          }
        } else if (order.paymentMethod === 'COD') {
          refundStatus = 'completed';
          refundTransactionId = `COD-REFUND-${Date.now()}`;
        }

        order.refundHistory.push({
          amount: refundAmount,
          type: 'exchange_difference',
          paymentMethod: order.paymentMethod,
          status: refundStatus,
          transactionId: refundTransactionId,
          reason: exchangeItem.reason,
          processedAt: new Date(),
        });
      } else {
        exchangeItem.status = 'completed';
      }

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Exchange processed successfully',
        order: order,
      });
    } else {
      // Reject exchange
      exchangeItem.status = 'rejected';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Exchange request rejected',
        order: order,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
