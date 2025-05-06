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
forgotPasswordSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  next();
});

const ForgotPassword = mongoose.model("ForgotPassword",forgotPasswordSchema,"forgot-password")

module.exports = ForgotPassword