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

orderProductSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  next();
});

const OrderProduct = mongoose.model("order-product", orderProductSchema, "order-product");

module.exports = OrderProduct;