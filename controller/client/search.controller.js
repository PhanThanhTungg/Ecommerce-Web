const Product = require("../../model/product.model");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let products = [];

  if(keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false
    }).sort({ position: "desc" })

    for (const item of products) {
      for(const size of item.listSize){
          size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
      }
    }
  }

  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: products
  });
};