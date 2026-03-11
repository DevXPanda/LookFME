const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");

// add a review
exports.addReview = async (req, res, next) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Check if user's reviews are blocked
    const user = await User.findById(userId);
    if (user && user.reviewBlocked) {
      return res.status(403).json({ message: "Your reviews have been blocked by admin." });
    }
    
    // Check if the user has already left a review for this product
    const existingReview = await Review.findOne({
      userId,
      productId,
    });
    if (existingReview) {
      return res.status(400).json({ message: "You have already left a review for this product." });
    }
    // Check if the user has a delivered order for this product
    const deliveredOrder = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      status: "delivered",
      "cart._id": { $in: [productId] },
    });
    if (!deliveredOrder) {
      return res.status(400).json({ message: "You can only review after delivery." });
    }
    // Create the new review (default visible = true)
    const review = await Review.create({ 
      userId, 
      productId, 
      rating, 
      comment,
      visible: true,
      isHiddenByAdmin: false,
    });
    // Add the review to the product's reviews array
    const product = await Products.findById(productId);
    if (product) {
      product.reviews.push(review._id);
      await product.save();
    }
    // Add the review to the user's reviews array (user already fetched above)
    if (user) {
      user.reviews.push(review._id);
      await user.save();
    }
    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// delete all reviews for a product (legacy)
exports.deleteReviews = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const result = await Review.deleteMany({ productId: productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product reviews not found' });
    }
    res.json({ message: 'All reviews deleted for the product' });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

// delete a single review by id (and remove from product + user)
async function removeReviewFromProductAndUser(review) {
  if (!review) return;
  const product = await Products.findById(review.productId);
  if (product && product.reviews && product.reviews.length) {
    product.reviews = product.reviews.filter(
      (id) => id.toString() !== review._id.toString()
    );
    await product.save();
  }
  const user = await User.findById(review.userId);
  if (user && user.reviews && user.reviews.length) {
    user.reviews = user.reviews.filter(
      (id) => id.toString() !== review._id.toString()
    );
    await user.save();
  }
}

exports.deleteReviewById = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await removeReviewFromProductAndUser(review);
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('deleteReviewById error:', error);
    next(error);
  }
};

exports.bulkDeleteReviews = async (req, res, next) => {
  try {
    const { reviewIds } = req.body || {};
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({ message: 'reviewIds array is required' });
    }
    const validIds = reviewIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const reviews = await Review.find({ _id: { $in: validIds } });
    for (const review of reviews) {
      await removeReviewFromProductAndUser(review);
    }
    const result = await Review.deleteMany({ _id: { $in: validIds } });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} review(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('bulkDeleteReviews error:', error);
    next(error);
  }
};

exports.bulkToggleVisibility = async (req, res, next) => {
  try {
    const { reviewIds, visible } = req.body || {};
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({ message: 'reviewIds array is required' });
    }
    if (typeof visible !== 'boolean') {
      return res.status(400).json({ message: 'visible (boolean) is required' });
    }
    const validIds = reviewIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const result = await Review.updateMany(
      { _id: { $in: validIds } },
      { $set: { visible, isHiddenByAdmin: !visible } }
    );
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} review(s) ${visible ? 'shown' : 'hidden'} successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('bulkToggleVisibility error:', error);
    next(error);
  }
};

// Toggle review visibility
exports.toggleReviewVisibility = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const visible = req.body?.visible;

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.visible = visible !== undefined ? Boolean(visible) : !review.visible;
    review.isHiddenByAdmin = !review.visible;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review ${review.visible ? 'shown' : 'hidden'} successfully`,
      data: review,
    });
  } catch (error) {
    console.error('toggleReviewVisibility error:', error);
    next(error);
  }
};

// Get all reviews for admin (with user and product details)
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'userId',
        select: 'name email imageURL reviewBlocked',
      })
      .populate({
        path: 'productId',
        select: 'title img',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
