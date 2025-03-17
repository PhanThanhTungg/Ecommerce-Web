const Product = require("../../../model/product.model");

module.exports.getRelatedProductByCategory = async (req, res) => {
  try {
    const listCategory = req.body.listCategory;
    const products = await Product.find({
      product_category_id: { $in: listCategory },
      status: "active",
      deleted: true
    }).sort({sales: "desc"});
    res.json({
      code: 200,
      products: products 
    })
  } catch (error) {
    res.json({
      code: 400
    })
  }
}