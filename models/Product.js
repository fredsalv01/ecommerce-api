const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    image: {
      type: String,
      required: false,
    },
    gallery: {
      type: Array,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
