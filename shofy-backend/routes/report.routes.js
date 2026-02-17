const express = require("express");
const {
  getTransactionReport,
  getSalesReport,
  getProfitReport,
  getProductReport,
  getOrderReport,
  getVATReport,
  exportReportData,
} = require("../controller/report.controller");

const router = express.Router();

// Transaction Report
router.get("/transaction", getTransactionReport);

// Sales Report
router.get("/sales", getSalesReport);

// Profit Report
router.get("/profit", getProfitReport);

// Product Report
router.get("/product", getProductReport);

// Order Report
router.get("/order", getOrderReport);

// VAT Report
router.get("/vat", getVATReport);

// Export Data
router.get("/export", exportReportData);

module.exports = router;
