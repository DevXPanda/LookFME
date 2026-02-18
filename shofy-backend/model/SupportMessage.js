const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    source: {
      type: String,
      default: "contact_form",
      enum: ["contact_form", "other"],
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "replied", "closed"],
    },
    adminReply: { type: String, default: null },
    repliedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
module.exports = SupportMessage;
