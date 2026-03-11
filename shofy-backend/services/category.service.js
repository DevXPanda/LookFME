const ApiError = require('../errors/api-error');
const Category = require('../model/Category');
const Products = require('../model/Products');

// create category service
exports.createCategoryService = async (data) => {
  const { parent, productType, img, description } = data;
  let children = data.children || [];

  // Trim all children names
  children = children.map(child => typeof child === 'string' ? child.trim() : child).filter(child => child !== "");

  // 1. Find or create the main category (the one specified in the 'Parent' field)
  let category = await Category.findOne({ parent });

  if (category) {
    // Update existing category
    const updateData = {
      $set: {
        productType: productType || category.productType,
      }
    };

    if (img) updateData.$set.img = img;
    if (description) updateData.$set.description = description;

    if (children && children.length > 0) {
      updateData.$addToSet = { children: { $each: children } };
    }

    await Category.updateOne({ _id: category._id }, updateData);
    category = await Category.findById(category._id);
  } else {
    // Create new category
    category = await Category.create(data);
  }

  // 2. Ensure each child category also has its own document
  if (children && children.length > 0) {
    for (const childName of children) {
      const childExist = await Category.findOne({ parent: childName });
      if (!childExist) {
        await Category.create({
          parent: childName,
          productType: productType,
          children: []
        });
      }
    }
  }

  return category;
}

// create all category service
exports.addAllCategoryService = async (data) => {
  await Category.deleteMany()
  const category = await Category.insertMany(data);
  return category;
}

// get all show category service
exports.getShowCategoryServices = async () => {
  const category = await Category.find({ status: 'Show' }).populate('products');
  return category;
}

// get all category 
exports.getAllCategoryServices = async () => {
  const category = await Category.find({})
  return category;
}

// get type of category service
exports.getCategoryTypeService = async (param) => {
  const categories = await Category.find({ productType: param }).populate('products');
  return categories;
}

// get type of category service
exports.deleteCategoryService = async (id) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
}

// update category
exports.updateCategoryService = async (id, payload) => {
  const isExist = await Category.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(404, 'Category not found !')
  }

  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await Category.findById(id);
  return result;
}

// bulk delete categories
exports.bulkDeleteCategoryService = async (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'Category ids are required');
  }
  const result = await Category.deleteMany({ _id: { $in: ids } });
  return result;
}

// bulk update category status (Show / Hide)
exports.bulkUpdateStatusService = async (ids, status) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'Category ids are required');
  }
  if (!['Show', 'Hide'].includes(status)) {
    throw new ApiError(400, 'Status must be Show or Hide');
  }
  const result = await Category.updateMany(
    { _id: { $in: ids } },
    { $set: { status } }
  );
  return result;
}