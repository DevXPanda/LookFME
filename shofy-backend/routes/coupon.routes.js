const express = require('express');
const router = express.Router();
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getHomepageCoupons,
  getProductCoupons,
} = require('../controller/coupon.controller');

//add a coupon
router.post('/add', addCoupon);

//add multiple coupon
router.post('/all', addAllCoupon);

//get all coupon
router.get('/', getAllCoupons);

//get homepage coupons
router.get('/homepage', getHomepageCoupons);

//get product coupons
router.get('/product/:productId', getProductCoupons);

//get a coupon
router.get('/:id', getCouponById);

//update a coupon
router.patch('/:id', updateCoupon);

//delete a coupon
router.delete('/:id', deleteCoupon);

module.exports = router;
