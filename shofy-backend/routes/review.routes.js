const express = require("express");
const router = express.Router();
const {
  addReview,
  deleteReviews,
  deleteReviewById,
  bulkDeleteReviews,
  bulkToggleVisibility,
  toggleReviewVisibility,
  getAllReviews,
} = require("../controller/review.controller");

// add a review
router.post("/", addReview);
// get all reviews for admin
router.get("/all", getAllReviews);
// delete a single review by id
router.delete("/one/:reviewId", deleteReviewById);
// bulk delete reviews
router.post("/bulk-delete", bulkDeleteReviews);
// bulk toggle visibility
router.patch("/bulk-visibility", bulkToggleVisibility);
// delete all reviews for a product (legacy)
router.delete("/delete/:id", deleteReviews);
// toggle single review visibility
router.patch("/:reviewId/visibility", toggleReviewVisibility);

module.exports = router;
