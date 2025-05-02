const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")   // slug de seo // vd: tu dong chuyen sản phẩm 1 thành san-pham-1
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
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
    images:{
      type: Array,
      default: []
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    featured: String,
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
)

productSchema.plugin(AutoIncrement, { inc_field: 'position' });
const Product = mongoose.model('Product', productSchema, "products")

module.exports = Product