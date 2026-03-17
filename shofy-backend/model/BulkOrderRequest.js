const mongoose = require("mongoose");

const bulkOrderItemSchema = new mongoose.Schema(
  {
    bulkProduct: { type: mongoose.Schema.Types.ObjectId, ref: "BulkProduct", default: null },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Products", default: null },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const bulkOrderRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    preferredContact: { type: String, enum: ["email", "phone"], default: "email" },
    items: [bulkOrderItemSchema],
    comments: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      lowercase: true,
    },
    statusHistory: [{
      status: { type: String, required: true },
      updatedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

const BulkOrderRequest = mongoose.models.BulkOrderRequest || mongoose.model("BulkOrderRequest", bulkOrderRequestSchema);
module.exports = BulkOrderRequest;
