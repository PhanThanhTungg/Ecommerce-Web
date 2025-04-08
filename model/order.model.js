const e = require("express");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    userInfo: {
      fullName: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      province: {
        type: String,
        required: true
      },
      district: {
        type: String,
        required: true
      },
      commune: {
        type: String,
        required: true
      },
      detail: {
        type: String,
        required: true
      },
      mapId: String
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    totalProductPrice: {
      type: Number,
      required: true
    },
    note: String,
    deliveryMethod: {
      type: String,
      required: true
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "pending-payment",
        "shipping",
        "delivered",
        "cancelled",
      ],
    },
    paymentStatus:{
      status:{
        type: String,
        enum: ["ok", "lack"]
      }, 
      lack: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["vnpay", "momo", "zalopay", "cash", "qr"]
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;