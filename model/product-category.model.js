const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")   // slug de seo // vd: tu dong chuyen sản phẩm 1 thành san-pham-1

mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: ""
    },
    description: String,
    thumbnail: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    position: Number,
    featured:{
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)


const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "categorys")

module.exports = ProductCategory