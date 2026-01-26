// Migration script: Convert all product and order prices from USD to INR
// Only run ONCE if your DB prices are still in USD!

const mongoose = require('mongoose');
const { secret } = require('../config/secret');
const Products = require('../model/Products');
const Order = require('../model/Order');

const CONVERSION_RATE = 83; // Example: 1 USD = 83 INR

async function migrate() {
  await mongoose.connect(secret.MONGO_URI);
  // Products
  const products = await Products.find();
  for (let p of products) {
    p.price = Math.round(p.price * CONVERSION_RATE);
    await p.save();
  }
  // Orders
  const orders = await Order.find();
  for (let o of orders) {
    if (Array.isArray(o.cart)) {
      o.cart.forEach(item => {
        if (item.price) item.price = Math.round(item.price * CONVERSION_RATE);
      });
    }
    if (typeof o.subTotal === 'number') o.subTotal = Math.round(o.subTotal * CONVERSION_RATE);
    if (typeof o.totalAmount === 'number') o.totalAmount = Math.round(o.totalAmount * CONVERSION_RATE);
    if (typeof o.discount === 'number') o.discount = Math.round(o.discount * CONVERSION_RATE);
    if (typeof o.shippingCost === 'number') o.shippingCost = Math.round(o.shippingCost * CONVERSION_RATE);
    await o.save();
  }
  console.log('Migration to INR complete.');
  process.exit();
}

migrate();
