const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser:{
      type: String,
      default: generate.generateRandomString(20)
    },
    phone: String,
    thumbnail:{
      type: String,
      default: "https://howkteam.vn/Content/images/avatar/avatar.png"
    },
    sex: String,
    cntSuccess: {
      type: Number,
      default: 0
    },
    cntFail: {
      type: Number,
      default: 0
    },
    totalValue: {
      type: Number,
      default: 0
    },
    rank:{
      type: String,
      default: "Vô hạng"
    },
    status:{
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model("User", userSchema, "customers")

module.exports = User