const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")   // slug de seo // vd: tu dong chuyen sản phẩm 1 thành san-pham-1

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
    discountPercentage: Number,
    thumbnail: String,
    images:{
      type: Array,
      default: []
    },
    status: String,
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

const Product = mongoose.model('Product', productSchema, "products")

module.exports = Product