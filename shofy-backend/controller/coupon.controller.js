const Coupon = require('../model/Coupon');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// addCoupon
const addCoupon = async (req, res, next) => {
  try {
    const newCoupon = new Coupon(req.body);
    if (!newCoupon.startTime) {
      newCoupon.startTime = new Date()
    }
    await newCoupon.save();
    res.send({ message: 'Coupon Added Successfully!' });
  } catch (error) {
    next(error)
  }
};
// addAllCoupon
const addAllCoupon = async (req, res, next) => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany(req.body);
    res.status(200).send({
      message: 'Coupon Added successfully!',
    });
  } catch (error) {
    next(error)
  }
};
// getAllCoupons
const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ _id: -1 });
    res.send(coupons);
  } catch (error) {
    next(error)
  }
};
// getCouponById
const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (error) {
    next(error)
  }
};
// updateCoupon
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.title = req.body.title;
      coupon.couponCode = req.body.couponCode;
      coupon.endTime = dayjs().utc().format(req.body.endTime);
      coupon.discountPercentage = req.body.discountPercentage;
      coupon.minimumAmount = req.body.minimumAmount;
      coupon.productType = req.body.productType;
      coupon.logo = req.body.logo;
      coupon.showOnHomepage = req.body.showOnHomepage !== undefined ? req.body.showOnHomepage : coupon.showOnHomepage;
      coupon.showOnProduct = req.body.showOnProduct !== undefined ? req.body.showOnProduct : coupon.showOnProduct;
      coupon.productIds = req.body.productIds || coupon.productIds;
      await coupon.save();
      res.send({ message: 'Coupon Updated Successfully!' });
    }
  } catch (error) {
    // console.log('coupon error',error)
    next(error)
  }
};
// deleteCoupon
const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Coupon delete successfully',
    })
  } catch (error) {
    next(error)
  }
};

// getHomepageCoupons - Get coupons that should be shown on homepage
const getHomepageCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ 
      showOnHomepage: true,
      status: "active",
      endTime: { $gte: new Date() }
    }).sort({ _id: -1 });
    res.send(coupons);
  } catch (error) {
    next(error)
  }
};

// getProductCoupons - Get coupons for a specific product
const getProductCoupons = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const coupons = await Coupon.find({ 
      showOnProduct: true,
      status: "active",
      endTime: { $gte: new Date() },
      $or: [
        { productIds: { $in: [productId] } },
        { productIds: { $size: 0 } } // Show coupons with no specific products (all products)
      ]
    }).sort({ _id: -1 });
    res.send(coupons);
  } catch (error) {
    next(error)
  }
};

module.exports = {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getHomepageCoupons,
  getProductCoupons,
};
