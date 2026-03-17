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
    orderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", 'cancel', 'returned', 'exchanged'],
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
      size: String,
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
      originalSize: String,
      originalPrice: Number,
      exchangeProductId: String,
      exchangeProductTitle: String,
      exchangeQuantity: Number,
      exchangeSize: String,
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

// generate SKU-like suffix (uppercase alphanumeric, 6 chars) for orderId
function generateSkuSuffix() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return suffix;
}

// generate unique orderId: YYYYMMDD + SKU-like suffix (no hyphen, no #) for display on both invoices
function generateOrderId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const datePart = `${y}${m}${d}`;
  const skuPart = generateSkuSuffix();
  return `${datePart}${skuPart}`;
}

// define pre-save middleware to generate invoice and orderId
orderSchema.pre("save", async function (next) {
  const order = this;
  try {
    if (!order.invoice) {
      order.invoice = await getNextInvoice();
    }
    if (!order.orderId) {
      const Order = this.constructor;
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = generateOrderId();
        const existing = await Order.findOne({ orderId: candidate });
        if (!existing) {
          order.orderId = candidate;
          break;
        }
      }
      if (!order.orderId) order.orderId = generateOrderId();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
