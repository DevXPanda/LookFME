const RefundRequest = require("../model/RefundRequest");
const Order = require("../model/Order");
const User = require("../model/User");

/**
 * GET /api/refunds - List all refund requests (admin only)
 */
exports.getRefundRequests = async (req, res, next) => {
  try {
    const rawStatus = req.query?.status;
    const status = typeof rawStatus === "string" ? rawStatus.trim() : "";
    const query = {};
    if (status && status !== "all") {
      // Case-insensitive status filtering
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }
    const refunds = await RefundRequest.find(query)
      .populate("orderId", "invoice name email totalAmount")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    // Always return 200 with empty array if no refunds found
    return res.status(200).json({
      success: true,
      data: refunds || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/refunds/:id/status - Update refund request status (admin only)
 */
exports.updateRefundStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "refunded", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use pending, approved, refunded, or rejected",
      });
    }
    const refund = await RefundRequest.findById(req.params.id);
    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }
    refund.status = status;
    await refund.save();
    const updated = await RefundRequest.findById(req.params.id)
      .populate("orderId", "invoice name email totalAmount")
      .populate("userId", "name email")
      .lean();
    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
