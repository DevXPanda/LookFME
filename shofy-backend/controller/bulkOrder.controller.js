const BulkOrderRequest = require("../model/BulkOrderRequest");
const BulkProduct = require("../model/BulkProduct");
const Product = require("../model/Products");

exports.submitRequest = async (req, res, next) => {
  try {
    const { name, email, phone, city, state, pinCode, preferredContact, items, comments, user: userId } = req.body;

    if (!name || !email || !phone || !city || !state || !pinCode) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, city, state and pin code are required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product with quantity is required",
      });
    }

    const validItems = [];
    for (const it of items) {
      const qty = Number(it.quantity);
      if (!qty || qty < 1) continue;
      if (it.bulkProduct) {
        const bulkProd = await BulkProduct.findById(it.bulkProduct).lean();
        if (!bulkProd || !bulkProd.isActive) continue;
        validItems.push({
          bulkProduct: bulkProd._id,
          product: null,
          productName: bulkProd.name,
          quantity: qty,
        });
      } else if (it.product) {
        const catalogProd = await Product.findById(it.product).select("title").lean();
        if (!catalogProd) continue;
        validItems.push({
          bulkProduct: null,
          product: catalogProd._id,
          productName: catalogProd.title,
          quantity: qty,
        });
      }
    }

    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one valid product with quantity",
      });
    }

    const request = await BulkOrderRequest.create({
      user: userId || null,
      name,
      email,
      phone,
      city,
      state,
      pinCode,
      preferredContact: preferredContact === "phone" ? "phone" : "email",
      items: validItems,
      comments: comments || "",
      status: "pending",
      statusHistory: [{ status: "pending", updatedAt: new Date() }],
    });

    return res.status(201).json({
      success: true,
      message: "Bulk order request submitted successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "accepted", "rejected"].includes(status.toLowerCase())) {
      filter.status = status.toLowerCase();
    }
    const requests = await BulkOrderRequest.find(filter)
      .populate("items.bulkProduct", "name")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const doc = await BulkOrderRequest.findById(req.params.id)
      .populate("items.bulkProduct", "name description")
      .lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Bulk order request not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const userEmail = (req.user?.email || "").toString().trim().toLowerCase();
    if (!userId && !userEmail) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    const filter = {};
    if (userId && userEmail) {
      filter.$or = [{ user: userId }, { email: new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }];
    } else if (userId) {
      filter.user = userId;
    } else {
      filter.email = new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    }
    const requests = await BulkOrderRequest.find(filter)
      .populate("items.bulkProduct", "name")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.getByEmail = async (req, res, next) => {
  try {
    const email = (req.query.email || "").toString().trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const requests = await BulkOrderRequest.find({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") })
      .populate("items.bulkProduct", "name")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "accepted", "rejected"];
    if (!status || !allowed.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Valid status (pending, accepted or rejected) is required",
      });
    }

    const request = await BulkOrderRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Bulk order request not found",
      });
    }

    const newStatus = status.toLowerCase();
    request.status = newStatus;
    if (!request.statusHistory) request.statusHistory = [];
    request.statusHistory.push({ status: newStatus, updatedAt: new Date() });
    await request.save();

    return res.status(200).json({
      success: true,
      message: `Bulk order request ${request.status} successfully`,
      data: request.toObject ? request.toObject() : request,
    });
  } catch (error) {
    next(error);
  }
};
