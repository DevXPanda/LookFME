require('dotenv').config();

/**
 * WARNING: This seed script DELETES all existing records in the database
 * and reinserts only the static demo data from utils/*.js.
 * Any products, categories, or brands added from the admin panel will be LOST.
 *
 * A backup of current products, categories, and brands is created automatically
 * before wiping (in backups/data-*.json). To restore them later, run:
 *   node scripts/restore-data.js
 */
const connectDB = require('./config/db');
const { backup } = require('./scripts/backup-data');

const Brand = require('./model/Brand');
const brandData = require('./utils/brands');

const Category = require('./model/Category');
const categoryData = require('./utils/categories');

const Products = require('./model/Products');
const productsData = require('./utils/products');

const Coupon = require('./model/Coupon');
const couponData = require('./utils/coupons');

const Order = require('./model/Order');
const orderData = require('./utils/orders');

const User = require('./model/User');
const userData = require('./utils/users');

const Reviews = require('./model/Review');
const reviewsData = require('./utils/reviews');

const Admin = require('./model/Admin');
const adminData = require('./utils/admin');

connectDB();
const importData = async () => {
  try {
    // Backup current products, categories, and brands before wiping (so you can restore later)
    console.log('Creating backup of current data before seed...');
    await backup();

    await Brand.deleteMany();
    await Brand.insertMany(brandData);

    await Category.deleteMany();
    await Category.insertMany(categoryData);

    await Products.deleteMany();
    await Products.insertMany(productsData);

    await Coupon.deleteMany();
    await Coupon.insertMany(couponData);

    await Order.deleteMany();
    await Order.insertMany(orderData);

    await User.deleteMany();
    await User.insertMany(userData);

    await Reviews.deleteMany();
    await Reviews.insertMany(reviewsData);

    await Admin.deleteMany();
    await Admin.insertMany(adminData);

    console.log('data inserted successfully!');
    process.exit();
  } catch (error) {
    console.log('error', error);
    process.exit(1);
  }
};

importData();
