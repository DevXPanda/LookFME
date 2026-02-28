const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true },
        message: { type: String },
        resumeUrl: { type: String, required: true },
        resumeId: { type: String },
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

const CareerApplication = mongoose.model("CareerApplication", careerApplicationSchema);
module.exports = CareerApplication;
