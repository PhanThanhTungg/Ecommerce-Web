const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    userToken: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
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

feedbackSchema.index({ product_id: 1, userToken: 1 });

const ProductFeedback = mongoose.model('ProductFeedback', feedbackSchema, "product-feedback");

module.exports = ProductFeedback;