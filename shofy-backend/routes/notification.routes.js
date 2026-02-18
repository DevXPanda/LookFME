const express = require("express");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controller/notification.controller");

const router = express.Router();

// Get all notifications
router.get("/", getNotifications);
// Get unread count
router.get("/unread-count", getUnreadCount);
// Mark notification as read
router.patch("/mark-read/:id", markAsRead);
// Mark all as read
router.patch("/mark-all-read", markAllAsRead);
// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;
