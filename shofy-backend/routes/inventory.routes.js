const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventory.controller');

router.get('/category-stock', inventoryController.getCategoryStock);
router.get('/low-stock', inventoryController.getLowStock);
router.get('/valuation', inventoryController.getStockValuation);
router.get('/sales-vs-stock', inventoryController.getSalesVsStock);

module.exports = router;
