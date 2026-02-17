const Banner = require("../model/Banner");

const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isEnabled: true }).sort({ order: 1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

const getAllBannersAdmin = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

const getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

const addBanner = async (req, res, next) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json({ success: true, message: "Banner added successfully", data: banner });
  } catch (error) {
    next(error);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, message: "Banner updated successfully", data: banner });
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBanners,
  getAllBannersAdmin,
  getBannerById,
  addBanner,
  updateBanner,
  deleteBanner,
};
