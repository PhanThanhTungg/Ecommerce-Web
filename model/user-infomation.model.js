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

userInformationSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  next();
});

const userInfomation = mongoose.model('user-information'/*ten model */, userInformationSchema, "user-information" /*ten collection*/)

module.exports = userInfomation

