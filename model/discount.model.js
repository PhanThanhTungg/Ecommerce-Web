const mongoose = require("mongoose")

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['coupon', 'shipping'],
      default: 'coupon',
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    condition: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      default: ()=> new Date()
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
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

const Discount = mongoose.model('Discount', discountSchema, "discounts")

module.exports = Discount

