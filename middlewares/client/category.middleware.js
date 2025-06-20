const ProductCategory = require("../../model/product-category.model");
const createTreeHelper = require("../../helpers/createTree.js");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    status: "active",
    deleted: false
  })

  const newProductsCategory = createTreeHelper.tree(productsCategory)

  res.locals.layoutProductsCategory = newProductsCategory

  next()
}