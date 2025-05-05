import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
// import AutoIncrement from 'mongoose-sequence'; // Uncomment and adjust if needed

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    product_category_id: {
      type: String,
      default: ""
    },
    description: String,
    listSize: [
      {
        size: String,
        price: Number,
        stock: Number
      }
    ],
    discountPercentage: {
      type: Number,
      default: 0
    },
    thumbnail: String,
    images: {
      type: Array,
      default: []
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    featured: {
      type: Boolean,
      default: false
    },
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    createBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    sales: {
      type: Number,
      default: 0
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ]
  },
  {
    timestamps: true
  }
);

// Uncomment and adjust if you want to use AutoIncrement
// productSchema.plugin(AutoIncrement(mongoose), { inc_field: 'position' });

const Product = mongoose.model('Product', productSchema, "products");

export default Product;