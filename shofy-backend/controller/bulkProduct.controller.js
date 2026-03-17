const BulkProduct = require("../model/BulkProduct");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await BulkProduct.find({ isActive: true }).sort({ name: 1 }).lean();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await BulkProduct.find({}).sort({ name: 1 }).lean();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }
    const product = await BulkProduct.create({
      name: name.trim(),
      description: description != null ? String(description) : "",
      isActive: isActive !== false,
    });
    return res.status(201).json({
      success: true,
      message: "Bulk product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await BulkProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Bulk product not found",
      });
    }
    const { name, description, isActive } = req.body;
    if (name != null) product.name = String(name).trim();
    if (description != null) product.description = String(description);
    if (typeof isActive === "boolean") product.isActive = isActive;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Bulk product updated successfully",
      data: product.toObject ? product.toObject() : product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await BulkProduct.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Bulk product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bulk product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
