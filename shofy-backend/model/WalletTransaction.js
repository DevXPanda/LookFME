const mongoose = require("mongoose");

const walletTransactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    newBalance: {
      type: Number,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional, if admin made the change
    },
  },
  {
    timestamps: true,
  }
);

const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);

module.exports = WalletTransaction;
