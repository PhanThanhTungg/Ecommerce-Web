const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    userInfo: {
      fullName: String,
      phone: String,
      province: String,
      district: String,
      commune: String,
      detail: String
    },
    totalPrice: String,
    note: String,
    deliveryStatus: String,
    paymentStatus:{
      status:String, //ok, change, lack
      change: Number,
      lack: Number,
    },
    paymentMethod: String,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;