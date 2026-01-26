const Product = require("../model/Products");
const Order = require("../model/Order");
const Category = require("../model/Category");

// Category Stock Details
exports.getCategoryStock = async (req, res) => {
  try {
    const products = await Product.find();
    const grouped = {};
    products.forEach((p) => {
      const cat = p.category?.name || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = { stock: 0 };
      grouped[cat].stock += p.quantity || 0;
    });
    const data = Object.entries(grouped).map(([category, v]) => {
  const catProducts = products.filter(p => (p.category?.name || 'Uncategorized') === category);
  const lowStock = catProducts.filter(p => (p.quantity || 0) < 10).length;
  const value = catProducts.reduce((acc, p) => acc + ((p.quantity || 0) * (p.price || 0)), 0);
  return { category, stock: v.stock, lowStock, value };
});
res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Inventory data error" });
  }
};

// Low Stock Alerts
exports.getLowStock = async (req, res) => {
  try {
    const products = await Product.find();
    const data = products.filter(p => (p.quantity || 0) < 10).map(p => ({ product: p.title, stock: p.quantity }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Inventory data error" });
  }
};

// Stock Valuation Report
exports.getStockValuation = async (req, res) => {
  try {
    const products = await Product.find();
    const data = products.map(p => ({
  product: p.title,
  stock: p.quantity,
  price: p.price,
  valuation: (p.quantity || 0) * (p.price || 0)
}));
res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Inventory data error" });
  }
};

// Product-wise Sales vs Stock Report
exports.getSalesVsStock = async (req, res) => {
  try {
    const products = await Product.find();
    const orders = await Order.find({ status: { $ne: 'cancel' } });
    const data = products.map((p) => {
  let sold = 0;
  orders.forEach((order) => {
    (order.cart || []).forEach((item) => {
      if (item.productId == String(p._id)) {
        sold += item.quantity || 0;
      }
    });
  });
  return {
    product: p.title,
    sold,
    stock: p.quantity
  };
});
res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Inventory data error" });
  }
};
