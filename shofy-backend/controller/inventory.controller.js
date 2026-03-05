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
    let data = [];

    products.forEach(p => {
      if (p.variations && p.variations.length > 0) {
        p.variations.forEach(v => {
          if ((v.stock || 0) < 10) {
            data.push({
              product: `${p.title} (${v.colorName} / ${v.attributeValue})`,
              sku: v.sku,
              stock: v.stock
            });
          }
        });
      } else {
        if ((p.quantity || 0) < 10) {
          data.push({
            product: p.title,
            sku: p.sku || 'N/A',
            stock: p.quantity
          });
        }
      }
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Inventory data error" });
  }
};

// Stock Valuation Report
exports.getStockValuation = async (req, res) => {
  try {
    const products = await Product.find();
    let data = [];

    products.forEach(p => {
      if (p.variations && p.variations.length > 0) {
        p.variations.forEach(v => {
          data.push({
            product: `${p.title} (${v.colorName} / ${v.attributeValue})`,
            sku: v.sku,
            stock: v.stock,
            price: v.price || p.price,
            valuation: (v.stock || 0) * (v.price || p.price || 0)
          });
        });
      } else {
        data.push({
          product: p.title,
          sku: p.sku || 'N/A',
          stock: p.quantity,
          price: p.price,
          valuation: (p.quantity || 0) * (p.price || 0)
        });
      }
    });

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
    let data = [];

    products.forEach(p => {
      if (p.variations && p.variations.length > 0) {
        p.variations.forEach(v => {
          let sold = 0;
          orders.forEach((order) => {
            (order.cart || []).forEach((item) => {
              if (item.productId == String(p._id) && item.sku === v.sku) {
                sold += item.quantity || 0;
              }
            });
          });
          data.push({
            product: `${p.title} (${v.colorName} / ${v.attributeValue})`,
            sku: v.sku,
            sold,
            stock: v.stock
          });
        });
      } else {
        let sold = 0;
        orders.forEach((order) => {
          (order.cart || []).forEach((item) => {
            if (item.productId == String(p._id)) {
              sold += item.quantity || 0;
            }
          });
        });
        data.push({
          product: p.title,
          sku: p.sku || 'N/A',
          sold,
          stock: p.quantity
        });
      }
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Inventory data error" });
  }
};
