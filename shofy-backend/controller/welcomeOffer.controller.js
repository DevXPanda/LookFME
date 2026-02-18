const WelcomeOffer = require("../model/WelcomeOffer");

/**
 * GET /api/welcome-offer - Public. Returns active offer config for banner/checkout.
 */
exports.getWelcomeOffer = async (req, res, next) => {
  try {
    let offer = await WelcomeOffer.findOne({ isActive: true }).lean();
    if (!offer) {
      const any = await WelcomeOffer.findOne().lean();
      const data = any ? { ...any, isActive: false } : { title: "", discountPercent: 0, isActive: false, bannerText: "" };
      return res.status(200).json({ success: true, data });
    }
    return res.status(200).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/welcome-offer/admin - Admin. Get current config (single record or create default).
 */
exports.getWelcomeOfferAdmin = async (req, res, next) => {
  try {
    let offer = await WelcomeOffer.findOne().sort({ createdAt: -1 }).lean();
    if (!offer) {
      offer = await WelcomeOffer.create({
        title: "Welcome Offer",
        discountPercent: 10,
        isActive: false,
        bannerText: "Get 10% off on your first order",
      });
      offer = offer.toObject ? offer.toObject() : offer;
    }
    return res.status(200).json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/welcome-offer - Admin. Upsert config. Only one active at a time.
 */
exports.updateWelcomeOffer = async (req, res, next) => {
  try {
    const { title, discountPercent, isActive, bannerText } = req.body;
    if (isActive === true) {
      await WelcomeOffer.updateMany({}, { $set: { isActive: false } });
    }
    let offer = await WelcomeOffer.findOne().sort({ createdAt: -1 });
    if (!offer) {
      offer = await WelcomeOffer.create({
        title: title != null ? title : "Welcome Offer",
        discountPercent: discountPercent != null ? Number(discountPercent) : 10,
        isActive: isActive === true,
        bannerText: bannerText != null ? bannerText : "",
      });
    } else {
      if (title != null) offer.title = title;
      if (discountPercent != null) offer.discountPercent = Number(discountPercent);
      if (typeof isActive === "boolean") offer.isActive = isActive;
      if (bannerText != null) offer.bannerText = bannerText;
      await offer.save();
    }
    const data = offer.toObject ? offer.toObject() : offer;
    return res.status(200).json({ success: true, message: "Welcome offer saved", data });
  } catch (error) {
    next(error);
  }
};
