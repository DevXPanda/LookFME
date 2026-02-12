const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: false
    },
    endTime: {
      type: Date,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    minimumAmount: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    showOnHomepage: {
      type: Boolean,
      default: false
    },
    showOnProduct: {
      type: Boolean,
      default: false
    },
    productIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }],
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
