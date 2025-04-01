const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
    shippingFee:{
      kmFree: Number,
      addFeePerKm: Number,
      urbanFee: Number,
      suburbanFee: Number,
      interProvincialFee: Number,
    }
  },
  {
    timestamps: true,
  }
)

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general")

module.exports = SettingGeneral