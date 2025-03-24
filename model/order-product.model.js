const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema(
  {
    order_id: String,
    product_id: String,
    size_id: String,
    product_title: String,
    size: String,
    price: Number,
    discountPercentage: Number,
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

const OrderProduct = mongoose.model("order-Product", orderProductSchema, "order-Product");

module.exports = OrderProduct;