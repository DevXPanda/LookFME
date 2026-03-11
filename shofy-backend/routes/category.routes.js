const express = require('express');
const router = express.Router();
// internal
const categoryController = require('../controller/category.controller');

// get
router.get('/get/:id', categoryController.getSingleCategory);
// add
router.post('/add', categoryController.addCategory);
// add All Category
router.post('/add-all', categoryController.addAllCategory);
// get all Category
router.get('/all', categoryController.getAllCategory);
// get Product Type Category
router.get('/show/:type', categoryController.getProductTypeCategory);
// get Show Category
router.get('/show', categoryController.getShowCategory);
// delete category
router.delete('/delete/:id', categoryController.deleteCategory);
// bulk delete categories
router.post('/delete-bulk', categoryController.bulkDeleteCategory);
// bulk update status (Show / Hide)
router.patch('/bulk-status', categoryController.bulkUpdateStatus);
// edit category
router.patch('/edit/:id', categoryController.updateCategory);

module.exports = router;