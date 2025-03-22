const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    userInfo: {
      fullName: String,
      phone: String,
      province: String,
      district: String,
      commune: String
    },
    totalPrice: Number,
    deliveryStatus: String,
    paymentStatus: String,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;