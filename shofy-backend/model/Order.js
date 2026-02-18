const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: [{}],
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    paymentIntent: {
      type: Object,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderNote: {
      type: String,
      required: false,
    },
    invoice: {
      type: Number,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered",'cancel', 'returned', 'exchanged'],
      lowercase: true,
    },
    cancelReason: {
      type: String,
      required: false,
    },
    returnReason: {
      type: String,
      required: false,
    },
    exchangeReason: {
      type: String,
      required: false,
    },
    returnItems: [{
      productId: String,
      productTitle: String,
      quantity: Number,
      price: Number,
      reason: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'refunded'],
        default: 'pending'
      },
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
      },
      refundTransactionId: String,
      requestedAt: {
        type: Date,
        default: Date.now
      },
    }],
    exchangeItems: [{
      originalProductId: String,
      originalProductTitle: String,
      originalQuantity: Number,
      originalPrice: Number,
      exchangeProductId: String,
      exchangeProductTitle: String,
      exchangeQuantity: Number,
      exchangePrice: Number,
      reason: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'awaiting_payment', 'rejected', 'completed'],
        default: 'pending'
      },
      priceDifference: Number,
      requestedAt: {
        type: Date,
        default: Date.now
      },
    }],
    refundHistory: [{
      amount: Number,
      type: {
        type: String,
        enum: ['full', 'partial', 'exchange_difference']
      },
      paymentMethod: String,
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed']
      },
      transactionId: String,
      reason: String,
      processedAt: Date,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    addressChangeHistory: [{
      oldAddress: {
        address: String,
        city: String,
        country: String,
        zipCode: String,
        contact: String,
      },
      newAddress: {
        address: String,
        city: String,
        country: String,
        zipCode: String,
        contact: String,
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

const { getNextInvoice } = require("./OrderCounter");

// define pre-save middleware to generate the invoice number (atomic to avoid E11000 duplicate key)
orderSchema.pre("save", async function (next) {
  const order = this;
  if (!order.invoice) {
    try {
      order.invoice = await getNextInvoice();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
