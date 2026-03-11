const express = require("express");
const router = express.Router();
const comboProductController = require("../controller/comboProduct.controller");

router.get("/", comboProductController.getAllComboProducts);
router.get("/:id", comboProductController.getComboProductById);
router.post("/", comboProductController.addComboProduct);
router.patch("/:id", comboProductController.updateComboProduct);
router.delete("/:id", comboProductController.deleteComboProduct);

module.exports = router;
