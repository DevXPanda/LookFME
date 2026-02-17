const Product = require("../model/Products");
const Order = require("../model/Order");
const dayjs = require("dayjs");

// Helper function to build date filter
const buildDateFilter = (month, year) => {
  let startDate, endDate;
  
  if (month && year) {
    // Specific month and year
    startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    endDate = dayjs(`${year}-${month}-01`).endOf("month").toDate();
  } else if (year) {
    // Entire year
    startDate = dayjs(`${year}-01-01`).startOf("year").toDate();
    endDate = dayjs(`${year}-12-31`).endOf("year").toDate();
  } else {
    // All time
    return {};
  }
  
  return {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };
};

// Transaction Report Service
exports.getTransactionReport = async (month, year) => {
  // For products, we don't filter by date as products are not time-bound
  // We count all products regardless of date filter
  
  const [totalProducts, activeProducts, inactiveProducts] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ status: "in-stock" }),
    Product.countDocuments({ status: { $in: ["out-of-stock", "discontinued"] } }),
  ]);

  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
  };
};

// Sales Report Service
exports.getSalesReport = async (month, year) => {
  const dateFilter = buildDateFilter(month, year);
  
  // Gross Sales - all orders including cancelled/returned
  const grossSalesResult = await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        grossSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Net Sales - excluding cancelled and returned orders
  const netSalesResult = await Order.aggregate([
    {
      $match: {
        ...dateFilter,
        status: { $nin: ["cancel", "returned"] },
      },
    },
    {
      $group: {
        _id: null,
        netSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  return {
    grossSales: grossSalesResult[0]?.grossSales || 0,
    netSales: netSalesResult[0]?.netSales || 0,
  };
};

// Profit Report Service
exports.getProfitReport = async (month, year) => {
  const dateFilter = buildDateFilter(month, year);
  
  // Get orders excluding cancelled/returned
  const orders = await Order.find({
    ...dateFilter,
    status: { $nin: ["cancel", "returned"] },
  }).populate("cart.productId", "price");

  let totalRevenue = 0;
  let totalDirectExpenses = 0;

  orders.forEach((order) => {
    totalRevenue += order.totalAmount || 0;
    
    // Calculate direct expenses (cost of goods sold)
    // Assuming cost is 60% of selling price (can be adjusted)
    // In real scenario, you'd have a cost field in products
    if (order.cart && Array.isArray(order.cart)) {
      order.cart.forEach((item) => {
        const itemPrice = item.price || item.productId?.price || 0;
        const quantity = item.quantity || 1;
        const costPrice = itemPrice * 0.6; // 60% cost assumption
        totalDirectExpenses += costPrice * quantity;
      });
    }
  });

  const grossProfit = totalRevenue - totalDirectExpenses;

  return {
    totalRevenue,
    totalDirectExpenses,
    grossProfit,
  };
};

// Product Report Service
exports.getProductReport = async (month, year) => {
  const dateFilter = buildDateFilter(month, year);
  
  // Total Products (always count all, not filtered by date)
  const totalProducts = await Product.countDocuments({});

  // Total Products Sold (from orders - filtered by date)
  const soldProductsResult = await Order.aggregate([
    {
      $match: {
        ...dateFilter,
        status: { $nin: ["cancel", "returned"] },
      },
    },
    {
      $unwind: "$cart",
    },
    {
      $group: {
        _id: null,
        totalSold: { $sum: { $ifNull: ["$cart.quantity", 0] } },
      },
    },
  ]);

  // Total Discount Given (filtered by date)
  const discountResult = await Order.aggregate([
    {
      $match: {
        ...dateFilter,
        status: { $nin: ["cancel", "returned"] },
      },
    },
    {
      $group: {
        _id: null,
        totalDiscount: { $sum: { $ifNull: ["$discount", 0] } },
      },
    },
  ]);

  // Product Stock (total quantity of all products - not filtered by date)
  const stockResult = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalStock: { $sum: { $ifNull: ["$quantity", 0] } },
      },
    },
  ]);

  // Wishlisted Count (placeholder - would need wishlist model)
  // For now, we'll use a placeholder value
  const wishlistedCount = 0;

  // Add to Cart Count (from orders - filtered by date)
  const cartCountResult = await Order.aggregate([
    {
      $match: dateFilter,
    },
    {
      $unwind: "$cart",
    },
    {
      $group: {
        _id: null,
        cartCount: { $sum: { $ifNull: ["$cart.quantity", 0] } },
      },
    },
  ]);

  return {
    totalProducts,
    totalProductSold: soldProductsResult[0]?.totalSold || 0,
    totalDiscountGiven: discountResult[0]?.totalDiscount || 0,
    productStock: stockResult[0]?.totalStock || 0,
    wishlistedCount,
    addToCartCount: cartCountResult[0]?.cartCount || 0,
  };
};

// Order Report Service
exports.getOrderReport = async (month, year) => {
  const dateFilter = buildDateFilter(month, year);
  
  const [
    totalOrders,
    totalOrderAmount,
    cancelledOrders,
    ongoingOrders,
    completedOrders,
  ] = await Promise.all([
    Order.countDocuments(dateFilter),
    Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]),
    Order.countDocuments({
      ...dateFilter,
      status: { $in: ["cancel", "canceled"] },
    }),
    Order.countDocuments({
      ...dateFilter,
      status: { $in: ["pending", "processing"] },
    }),
    Order.countDocuments({
      ...dateFilter,
      status: "delivered",
    }),
  ]);

  return {
    totalOrders,
    totalOrderAmount: totalOrderAmount[0]?.totalAmount || 0,
    cancelled: cancelledOrders,
    ongoing: ongoingOrders,
    completed: completedOrders,
  };
};

// VAT Report Service
exports.getVATReport = async (month, year) => {
  const dateFilter = buildDateFilter(month, year);
  
  // Calculate VAT (assuming 18% VAT rate - adjust as needed)
  const VAT_RATE = 0.18;
  
  const salesResult = await Order.aggregate([
    {
      $match: {
        ...dateFilter,
        status: { $nin: ["cancel", "returned"] },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalSales = salesResult[0]?.totalSales || 0;
  // VAT is calculated on the base amount (excluding VAT)
  // If totalAmount includes VAT: baseAmount = totalAmount / (1 + VAT_RATE)
  // VAT = baseAmount * VAT_RATE
  const baseAmount = totalSales / (1 + VAT_RATE);
  const totalVATCollected = baseAmount * VAT_RATE;

  return {
    totalVATCollected,
    totalSales,
    vatRate: VAT_RATE * 100, // Return as percentage
  };
};

// Export Data Service (for Excel export)
exports.getExportData = async (reportType, month, year) => {
  const dateFilter = buildDateFilter(month, year);
  
  switch (reportType) {
    case "transaction":
      return await exports.getTransactionReport(month, year);
    
    case "sales":
      return await exports.getSalesReport(month, year);
    
    case "profit":
      return await exports.getProfitReport(month, year);
    
    case "product":
      return await exports.getProductReport(month, year);
    
    case "order":
      return await exports.getOrderReport(month, year);
    
    case "vat":
      return await exports.getVATReport(month, year);
    
    default:
      throw new Error("Invalid report type");
  }
};
