const express = require("express");
const router = express.Router();
const bulkOrderController = require("../controller/bulkOrder.controller");
const { isAuth } = require("../config/auth");
const verifyToken = require("../middleware/verifyToken");

router.post("/submit", bulkOrderController.submitRequest);

router.get("/my-requests", verifyToken, bulkOrderController.getMyRequests);
router.get("/by-email", bulkOrderController.getByEmail);

router.get("/", isAuth, bulkOrderController.getRequests);
router.get("/:id", isAuth, bulkOrderController.getRequestById);
router.patch("/:id/status", isAuth, bulkOrderController.updateStatus);

module.exports = router;
