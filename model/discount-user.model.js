const mongoose = require("mongoose")

const discountUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    discountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discount',
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const DiscountUser = mongoose.model('DiscountUser', discountUserSchema, "discount-users")

module.exports = DiscountUser

