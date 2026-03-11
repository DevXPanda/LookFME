const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

const comboProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Combo title is required"],
      trim: true,
      maxLength: [200, "Title is too large"],
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    img: {
      type: String,
      required: true,
      validate: [validator.isURL, "Please provide a valid image URL"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    original_price: {
      type: Number,
      required: false,
      min: [0, "Original price cannot be negative"],
    },
    discount: {
      type: Number,
      required: false,
      min: [0, "Discount cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      name: { type: String, required: false },
      id: { type: ObjectId, ref: "Category", required: false },
    },
    combo_count: {
      type: Number,
      required: true,
      min: [1, "Combo must allow at least 1 item"],
      default: 3,
    },
    products: [
      {
        productId: {
          type: ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    banner_image: {
      type: String,
      required: false,
      validate: [validator.isURL, "Please provide a valid banner image URL"],
    },
  },
  { timestamps: true }
);

const ComboProduct = mongoose.model("ComboProduct", comboProductSchema);
module.exports = ComboProduct;
