const express = require("express");
const {
  paymentIntent,
  addOrder,
  getOrders,
  updateOrderStatus,
  getSingleOrder,
  updateOrderAddress,
  cancelOrder,
  returnOrExchangeOrder,
  processRefund,
  processExchange,
} = require("../controller/order.controller");

// router
const router = express.Router();

// get orders
router.get("/orders", getOrders);
// single order
router.get("/:id", getSingleOrder);
// add a create payment intent
router.post("/create-payment-intent", paymentIntent);
// save Order
router.post("/saveOrder", addOrder);
// update status
router.patch("/update-status/:id", updateOrderStatus);
// update order address
router.patch("/update-address/:id", updateOrderAddress);
// cancel order
router.patch("/cancel/:id", cancelOrder);
// return or exchange order
router.patch("/return-exchange/:id", returnOrExchangeOrder);
// process refund
router.patch("/process-refund/:id", processRefund);
// process exchange
router.patch("/process-exchange/:id", processExchange);

module.exports = router;
