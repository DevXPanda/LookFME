const mongoose = require("mongoose");

const welcomeOfferSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Welcome Offer" },
    discountPercent: { type: Number, default: 10, min: 0, max: 100 },
    isActive: { type: Boolean, default: false },
    bannerText: { type: String, default: "" },
  },
  { timestamps: true }
);

const WelcomeOffer = mongoose.model("WelcomeOffer", welcomeOfferSchema);
module.exports = WelcomeOffer;
