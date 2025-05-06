const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema(
  {
    facebookId: String,
    googleId: String,
    githubId: String,
    fullName: {
      type: String,
      index: true,
      trim: true
    },
    email: String,
    password: String,
    tokenUser:{
      type: String,
      default: ()=>generate.generateRandomString(20)
    },
    refreshToken: String,
    phone: String,
    thumbnail:{
      type: String,
      default: "https://howkteam.vn/Content/images/avatar/avatar.png"
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"]
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


userSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  next();
});

const User = mongoose.model("User", userSchema, "customers")

module.exports = User