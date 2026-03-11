/**
 * Backup current products, categories, and brands to a timestamped JSON file.
 * Run before seed.js to preserve admin-added data. Restore with restore-data.js.
 *
 * Usage: node scripts/backup-data.js
 * Output: backups/data-YYYY-MM-DD-HHMMSS.json
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const Product = require('../model/Products');
const Category = require('../model/Category');
const Brand = require('../model/Brand');

const BACKUPS_DIR = path.join(__dirname, '..', 'backups');

async function backup() {
  const [products, categories, brands] = await Promise.all([
    Product.find({}).lean(),
    Category.find({}).lean(),
    Brand.find({}).lean(),
  ]);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `data-${timestamp}.json`;
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
  const filepath = path.join(BACKUPS_DIR, filename);

  const payload = {
    exportedAt: new Date().toISOString(),
    productsCount: products.length,
    categoriesCount: categories.length,
    brandsCount: brands.length,
    products,
    categories,
    brands,
  };

  fs.writeFileSync(filepath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Backup saved: ${filepath}`);
  console.log(`  Products: ${products.length}, Categories: ${categories.length}, Brands: ${brands.length}`);
  return filepath;
}

async function runStandalone() {
  await connectDB();
  await backup();
  process.exit(0);
}

if (require.main === module) {
  runStandalone().catch((err) => {
    console.error('Backup failed:', err);
    process.exit(1);
  });
}

module.exports = { backup };
