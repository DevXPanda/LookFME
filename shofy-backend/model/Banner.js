const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    redirectLink: { type: String, default: "/shop" },
    image: { type: String, required: true },
    imageMobile: { type: String, default: "" },
    bannerType: { type: String, enum: ["homepage_hero", "homepage_secondary", "other"], default: "homepage_hero" },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
module.exports = Banner;
