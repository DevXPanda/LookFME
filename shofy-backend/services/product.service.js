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
exports.getAllProductsService = async () => {
  const products = await Product.find({}).populate({
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
  if (query.new === "true") {
    products = await Product.find({ productType: type })
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
  } else if (query.featured === "true") {
    products = await Product.find({
      productType: type,
      featured: true,
    }).populate({
      path: "reviews",
      match: { visible: { $ne: false } },
      populate: { 
        path: "userId", 
        select: "name email imageURL reviewBlocked",
        match: { reviewBlocked: { $ne: true } },
      },
    });
  } else if (query.topSellers === "true") {
    products = await Product.find({ productType: type })
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
  const products = await Product.find({ productType: type })
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
    product.title = currProduct.title;
    product.brand.name = currProduct.brand.name;
    product.brand.id = currProduct.brand.id;
    product.category.name = currProduct.category.name;
    product.category.id = currProduct.category.id;
    product.sku = currProduct.sku;
    product.img = currProduct.img;
    product.slug = currProduct.slug;
    product.unit = currProduct.unit;
    product.imageURLs = currProduct.imageURLs;
    product.tags = currProduct.tags;
    product.parent = currProduct.parent;
    product.children = currProduct.children;
    product.price = currProduct.price;
    product.discount = currProduct.discount;
    product.quantity = currProduct.quantity;
    product.status = currProduct.status;
    product.productType = currProduct.productType;
    product.description = currProduct.description;
    product.videoId = currProduct.videoId || product.videoId;
    product.additionalInformation = currProduct.additionalInformation;
    product.offerDate.startDate = currProduct.offerDate.startDate;
    product.offerDate.endDate = currProduct.offerDate.endDate;
    
    // Update variations and attributeType if provided
    if (currProduct.variations !== undefined) {
      product.variations = currProduct.variations;
    }
    if (currProduct.attributeType !== undefined) {
      product.attributeType = currProduct.attributeType;
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