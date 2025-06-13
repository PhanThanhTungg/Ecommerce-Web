const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    comment: String,
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);



feedbackSchema.index({ product_id: 1, userId: 1 });

const ProductFeedback = mongoose.model('ProductFeedback', feedbackSchema, "product-feedback");

module.exports = ProductFeedback;