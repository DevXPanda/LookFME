const express = require("express");
const router = express.Router();
const {
  getAllBanners,
  getAllBannersAdmin,
  getBannerById,
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controller/banner.controller");

router.get("/", getAllBanners);
router.get("/all", getAllBannersAdmin);
router.get("/single/:id", getBannerById);
router.patch("/:id", updateBanner);
router.delete("/:id", deleteBanner);
router.post("/", addBanner);

module.exports = router;
