const userManagementService = require("../services/user-management.service");

// Get all customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const queryParams = {
      search: req.query.search,
      status: req.query.status,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const customers = await userManagementService.getAllCustomersService(queryParams);
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// Get single customer
exports.getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await userManagementService.getCustomerByIdService(id);
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update customer status (block/unblock)
exports.updateCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const customer = await userManagementService.updateCustomerStatusService(
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: `Customer ${status === "blocked" ? "blocked" : "unblocked"} successfully`,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update wallet coins
exports.updateWalletCoins = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { coins, reason } = req.body;
    const adminId = req.user?.id || null;

    if (coins === undefined) {
      return res.status(400).json({
        success: false,
        message: "Coins value is required",
      });
    }

    const customer = await userManagementService.updateWalletCoinsService(
      id,
      coins,
      reason || "Admin adjustment",
      adminId
    );
    res.status(200).json({
      success: true,
      message: "Wallet coins updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer orders
exports.getCustomerOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await userManagementService.getCustomerOrdersService(id);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer reviews
exports.getCustomerReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await userManagementService.getCustomerReviewsService(id);
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer wallet transactions
exports.getCustomerWalletTransactions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transactions = await userManagementService.getCustomerWalletTransactionsService(id);
    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const result = await userManagementService.deleteReviewService(reviewId);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle review visibility
exports.toggleReviewVisibility = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { visible } = req.body;
    
    if (visible === undefined) {
      return res.status(400).json({
        success: false,
        message: "Visible parameter is required",
      });
    }

    const review = await userManagementService.toggleReviewVisibilityService(reviewId, visible);
    res.status(200).json({
      success: true,
      message: `Review ${visible ? "shown" : "hidden"} successfully`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Get all subscribers
exports.getAllSubscribers = async (req, res, next) => {
  try {
    const queryParams = {
      search: req.query.search,
      status: req.query.status,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    };
    const subscribers = await userManagementService.getAllSubscribersService(queryParams);
    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

// Add subscriber
exports.addSubscriber = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const subscriber = await userManagementService.addSubscriberService(email);
    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    if (error.message === "Email already subscribed") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Unsubscribe
exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const subscriber = await userManagementService.unsubscribeService(email);
    res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};
