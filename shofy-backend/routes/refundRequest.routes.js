const express = require("express");
const router = express.Router();
const { getRefundRequests, updateRefundStatus } = require("../controller/refundRequest.controller");
const { isAuth } = require("../config/auth");

router.get("/", isAuth, getRefundRequests);
router.patch("/:id/status", isAuth, updateRefundStatus);

module.exports = router;
