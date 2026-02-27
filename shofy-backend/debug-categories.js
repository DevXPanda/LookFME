require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./model/Category');
const connectDB = require('./config/db');

async function test() {
    await connectDB();
    const categories = await Category.find({});
    console.log('--- ALL CATEGORIES ---');
    categories.forEach(c => {
        console.log(`ID: ${c._id}, Parent: "${c.parent}", Children: ${JSON.stringify(c.children)}, ProductType: ${c.productType}`);
    });
    process.exit();
}

test();
