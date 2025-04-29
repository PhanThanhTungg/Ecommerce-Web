const e = require("express");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
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

orderSchema.pre("save", function(next){
  if(!this.orderId){
    this.orderId = this._id.toString().slice(-6);
  }
  next();
})

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;