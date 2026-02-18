const mongoose = require("mongoose");

const orderCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 },
  },
  { _id: false }
);

const OrderCounter =
  mongoose.models.OrderCounter || mongoose.model("OrderCounter", orderCounterSchema);

/**
 * Atomically get next order invoice number (avoids E11000 duplicate key on concurrent saves).
 * If the counter document does not exist, initializes it from the current max invoice in orders.
 */
async function getNextInvoice() {
  let doc = await OrderCounter.findById("orderInvoice");
  if (!doc) {
    const Order = mongoose.model("Order");
    const max = await Order.find({}).sort({ invoice: -1 }).limit(1).select({ invoice: 1 }).lean();
    const start = max.length && max[0].invoice != null ? max[0].invoice : 999;
    try {
      await OrderCounter.create({ _id: "orderInvoice", seq: start });
    } catch (e) {
      if (e.code !== 11000) throw e;
      // another process already created the counter, continue to $inc
    }
  }
  const result = await OrderCounter.findOneAndUpdate(
    { _id: "orderInvoice" },
    { $inc: { seq: 1 } },
    { new: true }
  );
  return result.seq;
}

module.exports = { OrderCounter, getNextInvoice };
