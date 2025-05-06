const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    addressId: {
      type: String,
      default: "20.97689475028883, 105.78036447266416"
    },
    copyright: String,
    apiKey:{
      apiOpenStreetMap: String
    },
    shippingFee:{
      freeShippingThreshold: Number,
      initialFee: Number,
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


settingGeneralSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  next();
});

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general")

module.exports = SettingGeneral