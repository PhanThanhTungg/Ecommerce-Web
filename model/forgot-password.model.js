const mongoose = require("mongoose")

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      index: { expires: 600 }  // don vi: s
    }
  },
  {
    timestamps: true,
  }
)


const ForgotPassword = mongoose.model("ForgotPassword",forgotPasswordSchema,"forgot-password")

module.exports = ForgotPassword