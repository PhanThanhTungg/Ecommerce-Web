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

feedbackSchema.pre('save', function (next) {
  const now = new Date();
  this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  next();
});

feedbackSchema.index({ product_id: 1, userId: 1 });

const ProductFeedback = mongoose.model('ProductFeedback', feedbackSchema, "product-feedback");

module.exports = ProductFeedback;