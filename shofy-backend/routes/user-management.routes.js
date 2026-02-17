const express = require("express");
const {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  updateWalletCoins,
  getCustomerOrders,
  getCustomerReviews,
  getCustomerWalletTransactions,
  deleteReview,
  toggleReviewVisibility,
  getAllSubscribers,
  addSubscriber,
  unsubscribe,
} = require("../controller/user-management.controller");

const router = express.Router();

// Customer routes
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.patch("/customers/:id/status", updateCustomerStatus);
router.patch("/customers/:id/wallet-coins", updateWalletCoins);
router.get("/customers/:id/orders", getCustomerOrders);
router.get("/customers/:id/reviews", getCustomerReviews);
router.get("/customers/:id/wallet-transactions", getCustomerWalletTransactions);

// Review management routes
router.delete("/reviews/:reviewId", deleteReview);
router.patch("/reviews/:reviewId/visibility", toggleReviewVisibility);

// Subscriber routes
router.get("/subscribers", getAllSubscribers);
router.post("/subscribers", addSubscriber);
router.post("/subscribers/unsubscribe", unsubscribe);

module.exports = router;
