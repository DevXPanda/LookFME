const ComboProduct = require("../model/ComboProduct");

exports.getAllComboProducts = async (req, res, next) => {
  try {
    const combos = await ComboProduct.find()
      .populate("products.productId", "title img variations imageURLs")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: combos,
    });
  } catch (error) {
    next(error);
  }
};

exports.getComboProductById = async (req, res, next) => {
  try {
    const combo = await ComboProduct.findById(req.params.id).populate(
      "products.productId"
    );
    if (!combo) {
      return res.status(404).json({
        success: false,
        message: "Combo product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: combo,
    });
  } catch (error) {
    next(error);
  }
};

exports.addComboProduct = async (req, res, next) => {
  try {
    const combo = await ComboProduct.create(req.body);
    res.status(201).json({
      success: true,
      message: "Combo product created successfully",
      data: combo,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComboProduct = async (req, res, next) => {
  try {
    const combo = await ComboProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!combo) {
      return res.status(404).json({
        success: false,
        message: "Combo product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Combo product updated successfully",
      data: combo,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComboProduct = async (req, res, next) => {
  try {
    const combo = await ComboProduct.findByIdAndDelete(req.params.id);
    if (!combo) {
      return res.status(404).json({
        success: false,
        message: "Combo product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Combo product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
