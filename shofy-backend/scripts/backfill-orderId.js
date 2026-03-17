/**
 * One-time migration: backfill orderId for existing orders that don't have it.
 * Run once: node scripts/backfill-orderId.js
 * After this, all orders will have orderId and both admin/user invoices show the same ID.
 */

const mongoose = require('mongoose');
const { secret } = require('../config/secret');
const Order = require('../model/Order');

async function backfill() {
  await mongoose.connect(secret.MONGO_URI);
  const orders = await Order.find({
    $or: [{ orderId: null }, { orderId: { $exists: false } }, { orderId: '' }],
  });
  console.log(`Found ${orders.length} orders without orderId. Backfilling...`);
  for (const order of orders) {
    order.orderId = undefined;
    await order.save();
  }
  console.log('Backfill complete. All orders now have orderId.');
  process.exit(0);
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});
