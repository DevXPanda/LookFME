const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  replyToMessage,
} = require("../controller/support.controller");
const { isAuth } = require("../config/auth");

// Public: submit from Contact Us form
router.post("/message", createMessage);

// Admin only: reply must come before /:id so "reply" is not captured as id
router.get("/", isAuth, getMessages);
router.post("/reply/:id", isAuth, replyToMessage);
router.get("/:id", isAuth, getMessageById);
router.patch("/:id/status", isAuth, updateMessageStatus);

module.exports = router;
