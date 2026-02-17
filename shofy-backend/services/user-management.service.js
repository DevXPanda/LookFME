const User = require("../model/User");
const Subscription = require("../model/Subscription");
const Order = require("../model/Order");
const Review = require("../model/Review");
const WalletTransaction = require("../model/WalletTransaction");
const mongoose = require("mongoose");

// Get all customers (users with role "user") with aggregations
exports.getAllCustomersService = async (queryParams = {}) => {
  const { search, status, sortBy = "createdAt", sortOrder = "desc" } = queryParams;
  
  // Build filter
  let filter = { role: "user" };
  
  if (status && status !== "all") {
    filter.status = status;
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  
  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;
  
  // Get customers with basic info
  const customers = await User.find(filter)
    .select("-password -confirmationToken -passwordResetToken")
    .sort(sort)
    .lean();
  
  // Get customer IDs
  const customerIds = customers.map((c) => c._id);
  
  // Aggregate orders data for all customers
  const ordersData = await Order.aggregate([
    {
      $match: {
        user: { $in: customerIds },
        status: { $nin: ["cancel", "returned"] }, // Only count completed orders
      },
    },
    {
      $group: {
        _id: "$user",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
      },
    },
  ]);
  
  // Create a map for quick lookup
  const ordersMap = {};
  ordersData.forEach((item) => {
    ordersMap[item._id.toString()] = {
      totalOrders: item.totalOrders,
      totalSpent: item.totalSpent,
    };
  });
  
  // Attach order statistics to customers
  const customersWithStats = customers.map((customer) => {
    const stats = ordersMap[customer._id.toString()] || {
      totalOrders: 0,
      totalSpent: 0,
    };
    return {
      ...customer,
      totalOrders: stats.totalOrders,
      totalSpent: stats.totalSpent,
    };
  });
  
  return customersWithStats;
};

// Get single customer by ID with stats
exports.getCustomerByIdService = async (id) => {
  const customer = await User.findById(id)
    .select("-password -confirmationToken -passwordResetToken")
    .lean();
  
  if (!customer) {
    throw new Error("Customer not found");
  }
  
  if (customer.role !== "user") {
    throw new Error("User is not a customer");
  }
  
  // Get order statistics
  const orderStats = await Order.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(id),
        status: { $nin: ["cancel", "returned"] },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
      },
    },
  ]);
  
  const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0 };
  
  return {
    ...customer,
    totalOrders: stats.totalOrders,
    totalSpent: stats.totalSpent,
  };
};

// Update customer status (block/unblock)
exports.updateCustomerStatusService = async (id, status) => {
  if (!["active", "inactive", "blocked"].includes(status)) {
    throw new Error("Invalid status. Must be 'active', 'inactive', or 'blocked'");
  }
  
  const customer = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select("-password -confirmationToken -passwordResetToken");
  
  if (!customer) {
    throw new Error("Customer not found");
  }
  
  if (customer.role !== "user") {
    throw new Error("User is not a customer");
  }
  
  return customer;
};

// Update wallet coins with transaction logging
exports.updateWalletCoinsService = async (id, coins, reason, adminId = null) => {
  if (typeof coins !== "number" || coins < 0) {
    throw new Error("Coins must be a non-negative number");
  }
  
  const customer = await User.findById(id);
  
  if (!customer) {
    throw new Error("Customer not found");
  }
  
  if (customer.role !== "user") {
    throw new Error("User is not a customer");
  }
  
  const previousBalance = customer.walletCoins || 0;
  const difference = coins - previousBalance;
  
  // Update customer wallet
  customer.walletCoins = coins;
  await customer.save();
  
  // Log transaction if there's a change
  if (difference !== 0) {
    await WalletTransaction.create({
      userId: id,
      type: difference > 0 ? "credit" : "debit",
      amount: Math.abs(difference),
      reason: reason || "Admin adjustment",
      previousBalance,
      newBalance: coins,
      adminId: adminId || null,
    });
  }
  
  const updatedCustomer = await User.findById(id).select(
    "-password -confirmationToken -passwordResetToken"
  );
  
  return updatedCustomer;
};

// Get customer orders
exports.getCustomerOrdersService = async (customerId) => {
  const orders = await Order.find({ user: customerId })
    .sort({ createdAt: -1 })
    .lean();
  return orders;
};

// Get customer reviews
exports.getCustomerReviewsService = async (customerId) => {
  const reviews = await Review.find({ userId: customerId })
    .populate({
      path: "productId",
      select: "title img",
    })
    .sort({ createdAt: -1 })
    .lean();
  return reviews;
};

// Get customer wallet transactions
exports.getCustomerWalletTransactionsService = async (customerId) => {
  const transactions = await WalletTransaction.find({ userId: customerId })
    .populate({
      path: "adminId",
      select: "name email",
    })
    .sort({ createdAt: -1 })
    .lean();
  return transactions;
};

// Delete review
exports.deleteReviewService = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }
  
  await Review.findByIdAndDelete(reviewId);
  return { message: "Review deleted successfully" };
};

// Hide/Show review
exports.toggleReviewVisibilityService = async (reviewId, visible) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }
  
  review.visible = visible;
  review.isHiddenByAdmin = !visible;
  await review.save();
  
  return review;
};

// Get all subscribers
exports.getAllSubscribersService = async (queryParams = {}) => {
  const { search, status, dateFrom, dateTo } = queryParams;
  
  let filter = {};
  
  if (status && status !== "all") {
    filter.status = status;
  }
  
  if (search) {
    filter.email = { $regex: search, $options: "i" };
  }
  
  if (dateFrom || dateTo) {
    filter.subscriptionDate = {};
    if (dateFrom) {
      filter.subscriptionDate.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      filter.subscriptionDate.$lte = new Date(dateTo);
    }
  }
  
  const subscribers = await Subscription.find(filter).sort({
    createdAt: -1,
  });
  return subscribers;
};

// Add subscriber
exports.addSubscriberService = async (email) => {
  // Check if email already exists
  const existingSubscriber = await Subscription.findOne({ email });
  
  if (existingSubscriber) {
    if (existingSubscriber.status === "active") {
      throw new Error("Email already subscribed");
    } else {
      // If unsubscribed before, reactivate
      existingSubscriber.status = "active";
      existingSubscriber.subscriptionDate = new Date();
      await existingSubscriber.save();
      return existingSubscriber;
    }
  }
  
  // Create new subscriber
  const subscriber = await Subscription.create({
    email,
    status: "active",
  });
  
  return subscriber;
};

// Unsubscribe
exports.unsubscribeService = async (email) => {
  const subscriber = await Subscription.findOne({ email });
  
  if (!subscriber) {
    throw new Error("Email not found in subscribers list");
  }
  
  if (subscriber.status === "unsubscribed") {
    throw new Error("Email is already unsubscribed");
  }
  
  subscriber.status = "unsubscribed";
  await subscriber.save();
  
  return subscriber;
};
