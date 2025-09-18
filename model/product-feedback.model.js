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
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    likesCount: {
      type: Number,
      default: 0
    },
    replies: {
      type: [
        new mongoose.Schema(
          {
            userId: { type: mongoose.Schema.Types.ObjectId, required: true },
            comment: { type: String, required: true },
            deleted: { type: Boolean, default: false }
          },
          { _id: true, timestamps: true }
        )
      ],
      default: []
    },
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