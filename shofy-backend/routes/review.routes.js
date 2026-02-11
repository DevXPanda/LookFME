const express = require("express");
const router = express.Router();
const { addReview, deleteReviews, toggleReviewVisibility, getAllReviews } = require("../controller/review.controller");

// add a review
router.post("/", addReview);
// delete reviews
router.delete("/delete/:id", deleteReviews);
// toggle review visibility
router.patch("/:reviewId/visibility", toggleReviewVisibility);
// get all reviews for admin
router.get("/all", getAllReviews);

module.exports = router;
