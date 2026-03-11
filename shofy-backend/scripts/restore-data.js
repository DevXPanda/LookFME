/**
 * Restore products, categories, and brands from a backup file.
 * Use this to bring back admin-added data after running seed.js (if you had run backup first).
 *
 * Usage:
 *   node scripts/restore-data.js                    # restore from latest backup
 *   node scripts/restore-data.js backups/data-*.json # restore from specific file
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../model/Products');
const Category = require('../model/Category');
const Brand = require('../model/Brand');

const BACKUPS_DIR = path.join(__dirname, '..', 'backups');

function toObjectId(v) {
  if (v == null) return v;
  if (v instanceof mongoose.Types.ObjectId) return v;
  if (typeof v === 'string' && mongoose.Types.ObjectId.isValid(v)) return new mongoose.Types.ObjectId(v);
  return v;
}

function normalizeProduct(doc) {
  const d = { ...doc };
  if (d._id) d._id = toObjectId(d._id);
  if (d.category?.id) d.category.id = toObjectId(d.category.id);
  if (d.brand?.id) d.brand.id = toObjectId(d.brand.id);
  if (Array.isArray(d.reviews)) d.reviews = d.reviews.map(toObjectId);
  return d;
}

function normalizeCategory(doc) {
  const d = { ...doc };
  if (d._id) d._id = toObjectId(d._id);
  if (Array.isArray(d.products)) d.products = d.products.map(toObjectId);
  return d;
}

function normalizeBrand(doc) {
  const d = { ...doc };
  if (d._id) d._id = toObjectId(d._id);
  return d;
}

function getLatestBackup() {
  if (!fs.existsSync(BACKUPS_DIR)) return null;
  const files = fs.readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith('data-') && f.endsWith('.json'))
    .map((f) => ({ name: f, mtime: fs.statSync(path.join(BACKUPS_DIR, f)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);
  return files.length ? path.join(BACKUPS_DIR, files[0].name) : null;
}

async function restore() {
  const fileArg = process.argv[2];
  const filepath = fileArg
    ? path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg)
    : getLatestBackup();

  if (!filepath || !fs.existsSync(filepath)) {
    console.error('No backup file found. Run backup first: node scripts/backup-data.js');
    console.error('Or pass a file: node scripts/restore-data.js backups/data-2025-03-11T12-00-00.json');
    process.exit(1);
  }

  const raw = fs.readFileSync(filepath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid backup JSON:', e.message);
    process.exit(1);
  }

  const products = data.products || [];
  const categories = data.categories || [];
  const brands = data.brands || [];

  if (products.length === 0 && categories.length === 0 && brands.length === 0) {
    console.error('Backup file is empty (no products, categories, or brands).');
    process.exit(1);
  }

  await connectDB();

  // Delete in order to avoid foreign key / reference issues
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Brand.deleteMany({});

  if (brands.length > 0) {
    const normalized = brands.map(normalizeBrand);
    await Brand.insertMany(normalized);
    console.log(`Restored ${brands.length} brands.`);
  }
  if (categories.length > 0) {
    const normalized = categories.map(normalizeCategory);
    await Category.insertMany(normalized);
    console.log(`Restored ${categories.length} categories.`);
  }
  if (products.length > 0) {
    const normalized = products.map(normalizeProduct);
    await Product.insertMany(normalized);
    console.log(`Restored ${products.length} products.`);
  }

  console.log('Restore completed. Products will appear in admin product list and frontend.');
  process.exit(0);
}

restore().catch((err) => {
  console.error('Restore failed:', err);
  process.exit(1);
});
