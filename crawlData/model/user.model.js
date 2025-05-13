import mongoose from "mongoose";
import * as generate from "../helper/generate.js";

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
    tokenUser: {
      type: String,
      default: () => generate.generateRandomString(20),
    },
    refreshToken: String,
    phone: String,
    thumbnail: {
      type: String,
      default: "https://howkteam.vn/Content/images/avatar/avatar.png",
    },
    sex: {
      type: String,
      enum: ["male", "female", "other", 'unknown'],
    },
    status: {
      type: String,
      default: "active",
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
);

const User = mongoose.model("User", userSchema, "customers");

export default User;