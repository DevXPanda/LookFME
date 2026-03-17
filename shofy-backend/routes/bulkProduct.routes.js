const express = require("express");
const router = express.Router();
const bulkProductController = require("../controller/bulkProduct.controller");
const { isAuth } = require("../config/auth");

router.get("/", bulkProductController.getProducts);

router.get("/admin", isAuth, bulkProductController.getAllProductsAdmin);
router.post("/", isAuth, bulkProductController.createProduct);
router.patch("/:id", isAuth, bulkProductController.updateProduct);
router.delete("/:id", isAuth, bulkProductController.deleteProduct);

module.exports = router;
