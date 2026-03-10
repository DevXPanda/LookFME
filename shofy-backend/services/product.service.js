const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");

// create product service
exports.createProductService = async (data) => {
  // Validate variations if they exist
  if (data.variations && data.variations.length > 0) {
    // Check for duplicate SKUs
    const skus = data.variations.map((v) => v.sku).filter((sku) => sku && sku.trim() !== "");
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      throw new Error("Duplicate SKUs found in variations. Each variation must have a unique SKU.");
    }

    // Check if any of these SKUs already exist in DB
    const existingSkuProduct = await Product.findOne({ 
      $or: [
        { sku: { $in: skus } },
        { "variations.sku": { $in: skus } }
      ]
    });
    if (existingSkuProduct) {
      throw new Error("This SKU is already in use, please enter a different SKU");
    }

    // Validate all variations have required fields
    for (const variation of data.variations) {
      if (!variation.sku || !variation.sku.trim()) {
        throw new Error("All variations must have a valid SKU.");
      }
      if (variation.stock === undefined || variation.stock < 0) {
        throw new Error("All variations must have a non-negative stock value.");
      }
      if (!variation.attributeType || !variation.attributeValue) {
        throw new Error("All variations must have attributeType and attributeValue.");
      }
    }

    // If variations exist, set quantity to sum of variation stocks
    if (data.variations.length > 0) {
      data.quantity = data.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
  } else if (data.sku) {
    // Check main product SKU uniqueness
    const existingSkuProduct = await Product.findOne({ 
      $or: [
        { sku: data.sku },
        { "variations.sku": data.sku }
      ]
    });
    if (existingSkuProduct) {
      throw new Error("This SKU is already in use, please enter a different SKU");
    }
  }

  const product = await Product.create(data);
  const { _id: productId, brand, category } = product;
  //update Brand
  if (brand && brand.id) {
    await Brand.updateOne(
      { _id: brand.id },
      { $push: { products: productId } }
    );
  }
  //Category Brand
  if (category && category.id) {
    await Category.updateOne(
      { _id: category.id },
      { $push: { products: productId } }
    );
  }
  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  await Product.deleteMany();
  const products = await Product.insertMany(data);
  for (const product of products) {
    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(product.category.id, {
      $push: { products: product._id },
    });
  }
  return products;
};

// get product data
exports.getAllProductsService = async (query = {}) => {
  const { searchTerm } = query;
  let findQuery = {};

  if (searchTerm) {
    findQuery = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
        { "variations.sku": { $regex: searchTerm, $options: "i" } }
      ]
    };
  }

  const products = await Product.find(findQuery).populate({
    path: "reviews",
    match: { visible: { $ne: false } },
    populate: {
      path: "userId",
      select: "name email imageURL reviewBlocked",
      match: { reviewBlocked: { $ne: true } },
    },
  });

  // Filter out reviews where user is blocked or review is hidden
  products.forEach(product => {
    if (product.reviews) {
      product.reviews = product.reviews.filter(review =>
        review &&
        review.visible !== false &&
        review.userId &&
        review.userId.reviewBlocked !== true
      );
    }
  });

  return products;
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;
  if (query.new === "true" || query.new === true) {
    products = await Product.find({
      productType: type,
      showInLayout: { $in: ["New Arrivals", "All Sections"] },
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate({
        path: "reviews",
        match: { visible: { $ne: false } },
        populate: {
          path: "userId",
          select: "name email imageURL reviewBlocked",
          match: { reviewBlocked: { $ne: true } },
        },
      });
  } else if (query.featured === "true" || query.featured === true) {
    products = await Product.find({
      productType: type,
      showInLayout: { $in: ["This Week’s Featured", "All Sections"] },
    }).populate({
      path: "reviews",
      match: { visible: { $ne: false } },
      populate: {
        path: "userId",
        select: "name email imageURL reviewBlocked",
        match: { reviewBlocked: { $ne: true } },
      },
    });
  } else if (query.designer_embroidery === "true" || query.designer_embroidery === true) {
    products = await Product.find({
      productType: type,
      showInLayout: { $in: ["designer_embroidery", "All Sections"] },
    }).populate({
      path: "reviews",
      match: { visible: { $ne: false } },
      populate: {
        path: "userId",
        select: "name email imageURL reviewBlocked",
        match: { reviewBlocked: { $ne: true } },
      },
    });
  } else if (query.topSellers === "true" || query.topSellers === true) {
    products = await Product.find({
      productType: type,
      showInLayout: { $in: ["All Sections", "New Arrivals", "Popular on LookFame", "This Week’s Featured"] } // Allow all for Best Sellers or limit? User didn't specify, but let's be safe.
    })
      .sort({ sellCount: -1 })
      .limit(8)
      .populate({
        path: "reviews",
        match: { visible: { $ne: false } },
        populate: {
          path: "userId",
          select: "name email imageURL reviewBlocked",
          match: { reviewBlocked: { $ne: true } },
        },
      });
  } else {
    // Default case (All Collection/Shop) - show everything for that type
    products = await Product.find({ productType: type }).populate({
      path: "reviews",
      match: { visible: { $ne: false } },
      populate: {
        path: "userId",
        select: "name email imageURL reviewBlocked",
        match: { reviewBlocked: { $ne: true } },
      },
    });
  }

  // Filter out reviews where user is blocked or review is hidden
  products = products.map(product => {
    if (product.reviews) {
      product.reviews = product.reviews.filter(review =>
        review &&
        review.visible !== false &&
        review.userId &&
        review.userId.reviewBlocked !== true
      );
    }
    return product;
  });

  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await Product.find({
    productType: query,
    "offerDate.endDate": { $gt: new Date() },
  }).populate({
    path: "reviews",
    match: { visible: { $ne: false } },
    populate: {
      path: "userId",
      select: "name email imageURL reviewBlocked",
      match: { reviewBlocked: { $ne: true } },
    },
  });

  // Filter out reviews where user is blocked or review is hidden
  products.forEach(product => {
    if (product.reviews) {
      product.reviews = product.reviews.filter(review =>
        review &&
        review.visible !== false &&
        review.userId &&
        review.userId.reviewBlocked !== true
      );
    }
  });

  return products;
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  const products = await Product.find({
    productType: type,
    showInLayout: { $in: ["Popular on LookFame", "All Sections"] }
  })
    .sort({ "reviews.length": -1 })
    .limit(8)
    .populate({
      path: "reviews",
      match: { visible: { $ne: false } },
      populate: {
        path: "userId",
        select: "name email imageURL reviewBlocked",
        match: { reviewBlocked: { $ne: true } },
      },
    });

  // Filter out reviews where user is blocked or review is hidden
  products.forEach(product => {
    if (product.reviews) {
      product.reviews = product.reviews.filter(review =>
        review &&
        review.visible !== false &&
        review.userId &&
        review.userId.reviewBlocked !== true
      );
    }
  });

  return products;
};

exports.getTopRatedProductService = async () => {
  const products = await Product.find({
    reviews: { $exists: true, $ne: [] },
  }).populate({
    path: "reviews",
    match: { visible: { $ne: false } },
    populate: {
      path: "userId",
      select: "name email imageURL reviewBlocked",
      match: { reviewBlocked: { $ne: true } },
    },
  });

  const topRatedProducts = products
    .map((product) => {
      // Filter out reviews where user is blocked or review is hidden
      const visibleReviews = product.reviews.filter(review =>
        review &&
        review.visible !== false &&
        review.userId &&
        review.userId.reviewBlocked !== true
      );

      if (visibleReviews.length === 0) return null;

      const totalRating = visibleReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / visibleReviews.length;

      return {
        ...product.toObject(),
        reviews: visibleReviews,
        rating: averageRating,
      };
    })
    .filter(product => product !== null);

  topRatedProducts.sort((a, b) => b.rating - a.rating);

  return topRatedProducts;
};

// get product data
exports.getProductService = async (id) => {
  const product = await Product.findById(id).populate({
    path: "reviews",
    match: { visible: { $ne: false } }, // Only show visible reviews
    populate: {
      path: "userId",
      select: "name email imageURL reviewBlocked",
      match: { reviewBlocked: { $ne: true } }, // Only show reviews from non-blocked users
    },
  });

  // Filter out reviews where user is blocked or review is hidden
  if (product && product.reviews) {
    product.reviews = product.reviews.filter(review =>
      review &&
      review.visible !== false &&
      review.userId &&
      review.userId.reviewBlocked !== true
    );
  }

  return product;
};

// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await Product.findById(productId);

  const relatedProducts = await Product.find({
    "category.name": currentProduct.category.name,
    _id: { $ne: productId }, // Exclude the current product ID
  }).populate({
    path: "reviews",
    match: { visible: { $ne: false } },
    populate: {
      path: "userId",
      select: "name email imageURL reviewBlocked",
      match: { reviewBlocked: { $ne: true } },
    },
  });

  // Filter out reviews where user is blocked or review is hidden
  relatedProducts.forEach(product => {
    if (product.reviews) {
      product.reviews = product.reviews.filter(review =>
        review &&
        review.visible !== false &&
        review.userId &&
        review.userId.reviewBlocked !== true
      );
    }
  });

  return relatedProducts;
};

// update a product
exports.updateProductService = async (id, currProduct) => {
  // Validate variations if they exist
  if (currProduct.variations && currProduct.variations.length > 0) {
    // Check for duplicate SKUs
    const skus = currProduct.variations.map((v) => v.sku).filter((sku) => sku && sku.trim() !== "");
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      throw new Error("Duplicate SKUs found in variations. Each variation must have a unique SKU.");
    }

    // Validate all variations have required fields
    for (const variation of currProduct.variations) {
      if (!variation.sku || !variation.sku.trim()) {
        throw new Error("All variations must have a valid SKU.");
      }
      if (variation.stock === undefined || variation.stock < 0) {
        throw new Error("All variations must have a non-negative stock value.");
      }
      if (!variation.attributeType || !variation.attributeValue) {
        throw new Error("All variations must have attributeType and attributeValue.");
      }
    }

    // If variations exist, set quantity to sum of variation stocks
    if (currProduct.variations.length > 0) {
      currProduct.quantity = currProduct.variations.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
  }

  const product = await Product.findById(id);
  if (product) {
    if (currProduct.title !== undefined) product.title = currProduct.title;
    if (currProduct.brand) {
      if (currProduct.brand.name !== undefined) product.brand.name = currProduct.brand.name;
      if (currProduct.brand.id !== undefined) product.brand.id = currProduct.brand.id;
    }
    if (currProduct.category) {
      if (currProduct.category.name !== undefined) product.category.name = currProduct.category.name;
      if (currProduct.category.id !== undefined) product.category.id = currProduct.category.id;
    }
    if (currProduct.sku !== undefined) product.sku = currProduct.sku;
    if (currProduct.img !== undefined) product.img = currProduct.img;
    if (currProduct.slug !== undefined) product.slug = currProduct.slug;
    if (currProduct.unit !== undefined) product.unit = currProduct.unit;
    if (currProduct.imageURLs !== undefined) {
      product.imageURLs = [];
      product.imageURLs = currProduct.imageURLs;
    }
    if (currProduct.supportingImages !== undefined) {
      product.supportingImages = [];
      product.supportingImages = currProduct.supportingImages;
    }
    if (currProduct.tags !== undefined) {
      product.tags = [];
      product.tags = currProduct.tags;
    }
    if (currProduct.parent !== undefined) product.parent = currProduct.parent;
    if (currProduct.children !== undefined) product.children = currProduct.children;
    if (currProduct.price !== undefined) product.price = currProduct.price;
    if (currProduct.discount !== undefined) product.discount = currProduct.discount;
    if (currProduct.quantity !== undefined) product.quantity = currProduct.quantity;
    if (currProduct.status !== undefined) product.status = currProduct.status;
    if (currProduct.productType !== undefined) product.productType = currProduct.productType;
    if (currProduct.description !== undefined) product.description = currProduct.description;
    if (currProduct.videoId !== undefined) product.videoId = currProduct.videoId;
    if (currProduct.additionalInformation !== undefined) product.additionalInformation = currProduct.additionalInformation;

    if (currProduct.offerDate) {
      if (!product.offerDate) product.offerDate = {};
      if (currProduct.offerDate.startDate !== undefined) product.offerDate.startDate = currProduct.offerDate.startDate;
      if (currProduct.offerDate.endDate !== undefined) product.offerDate.endDate = currProduct.offerDate.endDate;
    }

    // Update variations and attributeType if provided
    if (currProduct.variations !== undefined) {
      product.variations = currProduct.variations;
    }
    if (currProduct.attributeType !== undefined) {
      product.attributeType = currProduct.attributeType;
    }
    if (currProduct.showInLayout !== undefined) {
      product.showInLayout = currProduct.showInLayout;
    }

    await product.save();
  }

  return product;
};



// get Reviews Products
exports.getReviewsProducts = async () => {
  const result = await Product.find({
    reviews: { $exists: true, $ne: [] },
  })
    .populate({
      path: "reviews",
      match: { visible: { $ne: false } }, // Only show visible reviews
      populate: {
        path: "userId",
        select: "name email imageURL reviewBlocked",
        match: { reviewBlocked: { $ne: true } }, // Only show reviews from non-blocked users
      },
    });

  // Filter products that have visible reviews after population
  const products = result.filter(p => {
    // Filter out reviews where user is blocked or review is hidden
    const visibleReviews = p.reviews.filter(review =>
      review &&
      review.visible !== false &&
      review.userId &&
      review.userId.reviewBlocked !== true
    );
    return visibleReviews.length > 0;
  });

  return products;
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await Product.find({ status: "out-of-stock" }).sort({ createdAt: -1 })
  return result;
};

// get Reviews Products
exports.deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id)
  return result;
};