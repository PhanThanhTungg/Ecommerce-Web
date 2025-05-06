const mongoose = require("mongoose");
const userInformationSchema = new mongoose.Schema(
  {
    user_id: String,
    fullName: String,
    phone: String,
    province: String,
    district: String,
    commune: String,
    detail: String
  },
  {
    timestamps: true
  }
);


const userInfomation = mongoose.model('user-information'/*ten model */, userInformationSchema, "user-information" /*ten collection*/)

module.exports = userInfomation

