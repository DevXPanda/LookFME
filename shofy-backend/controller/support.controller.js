const SupportMessage = require("../model/SupportMessage");
const { sendEmailPromise } = require("../config/email");
const { secret } = require("../config/secret");

/**
 * POST /api/support/message - Create support message (public, from Contact Us form)
 */
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required",
      });
    }
    const doc = await SupportMessage.create({
      name,
      email,
      subject,
      message,
      source: "contact_form",
      status: "open",
    });
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/support - List all support messages (admin only)
 */
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await SupportMessage.find()
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/support/:id - Get single support message (admin only)
 */
exports.getMessageById = async (req, res, next) => {
  try {
    const message = await SupportMessage.findById(req.params.id).lean();
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Support message not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/support/:id/status - Update message status (admin only)
 */
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["open", "replied", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use open, replied or closed",
      });
    }
    const message = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Support message not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Status updated",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/support/reply/:id - Admin reply to support message (admin only)
 * Sends email to ticket holder, then updates status/adminReply/repliedAt.
 * Does not update DB if email fails.
 */
exports.replyToMessage = async (req, res, next) => {
  try {
    const reply = req.body.reply != null ? String(req.body.reply).trim() : "";
    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const ticket = await SupportMessage.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support message not found",
      });
    }

    const emailBody = {
      from: secret.email_user,
      to: ticket.email,
      subject: "Reply to your query – LookFame",
      html: `
        <p>Hi ${ticket.name},</p>
        <p>${reply.replace(/\n/g, "<br>")}</p>
        <p>Regards,<br>LookFame Support Team</p>
      `,
    };

    await sendEmailPromise(emailBody);

    ticket.status = "replied";
    ticket.adminReply = reply;
    ticket.repliedAt = new Date();
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: ticket.toObject ? ticket.toObject() : ticket,
    });
  } catch (error) {
    if (error.code === "ESOCKET" || error.responseCode || error.command) {
      return res.status(503).json({
        success: false,
        message: "Failed to send email. Please try again.",
      });
    }
    next(error);
  }
};
