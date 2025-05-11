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
    },
    banner: [
      {
        image: String,
        subTitle: String,
        title: String
      }
    ]
  },
  {
    timestamps: true,
  }
)




const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general")

module.exports = SettingGeneral