const CareerApplication = require("../model/CareerApplication");
const Notification = require("../model/Notification");
const { sendEmailPromise } = require("../config/email");
const { secret } = require("../config/secret");

exports.submitApplication = async (req, res, next) => {
    try {
        const { name, email, role, resumeUrl, resumeId, message } = req.body;

        if (!name || !email || !role || !resumeUrl) {
            return res.status(400).json({
                success: false,
                message: "Name, email, role, and resume are required",
            });
        }

        const application = await CareerApplication.create({
            name,
            email,
            role,
            message,
            resumeUrl,
            resumeId,
            status: "open",
        });

        // Notify admins about new application
        await Notification.create({
            type: "career_application",
            title: "New Career Application",
            message: `${name} has applied for the ${role} position.`,
            metadata: { applicationId: application._id },
        });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

exports.getApplications = async (req, res, next) => {
    try {
        const applications = await CareerApplication.find()
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

exports.getApplicationById = async (req, res, next) => {
    try {
        const doc = await CareerApplication.findById(req.params.id).lean();
        if (!doc) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: doc,
        });
    } catch (error) {
        next(error);
    }
};

exports.replyToApplication = async (req, res, next) => {
    try {
        const reply = req.body.reply != null ? String(req.body.reply).trim() : "";
        if (!reply) {
            return res.status(400).json({
                success: false,
                message: "Reply message is required",
            });
        }

        const application = await CareerApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const emailBody = {
            from: secret.email_user,
            to: application.email,
            subject: `Update on your application for ${application.role} – LookFame`,
            html: `
        <p>Hi ${application.name},</p>
        <p>${reply.replace(/\n/g, "<br>")}</p>
        <p>Regards,<br>LookFame Careers Team</p>
      `,
        };

        await sendEmailPromise(emailBody);

        application.status = "replied";
        application.adminReply = reply;
        application.repliedAt = new Date();
        await application.save();

        return res.status(200).json({
            success: true,
            message: "Reply sent successfully",
            data: application.toObject ? application.toObject() : application,
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
