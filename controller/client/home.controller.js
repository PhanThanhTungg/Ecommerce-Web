const Product = require("../../model/product.model")
const paginationHelper = require("../../helpers/pagination")
module.exports.index = async (req, res) => {
  const find = {
    status: "active",
    deleted: false
  }

  const topProduct = await Product.find({
    status: "active",
    deleted: false
  }).limit(10).sort({ sales: "desc" })

  for (const item of topProduct) {
    for (const size of item.listSize) {
      size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }

  const productsFeatured = await Product.find({
    featured: "1",
    status: "active",
    deleted: false,
  })

  for (const item of productsFeatured) {
    for (const size of item.listSize) {
      size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }

  //sort
  let sort = {}
  let sortPrice;
  const [sortKey, sortValue] = [req.query.sortKey, req.query.sortValue];
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue === "asc" ? 1 : -1;
    if (sortKey === "price") {
      sortPrice = (sortValue == "desc"?-1:1);
    }
  }
  else {
    sort.position = 1;
  }

  //end sort

  //Pagigation
  let objectPagination = await paginationHelper(req, await Product.countDocuments(find), 1, 12);
  //End pagigation

  const pipeline = [
    { $match: { status: "active", deleted: false } },
    { $addFields: { firstPrice: { $arrayElemAt: ["$listSize.price", 0] } } },
    { $sort: sortKey!=="price"?sort:{ firstPrice: sortPrice } },
    { $skip: objectPagination.skip },
    { $limit: objectPagination.limit }
  ];

  const productsNew = await Product.aggregate(pipeline);

  for (const item of productsNew) {
    for (const size of item.listSize) {
      size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: productsFeatured,
    productsNew: productsNew,
    pagination: objectPagination,
    topProduct: topProduct
  })
}

module.exports.contact = async (req, res) => {
  res.render("client/pages/contact/index", {
  })
}

module.exports.contactPost = async (req, res) => {
  req.flash("success", "Gửi feedback thành công, chúng tôi sẽ liên lạc sớm nhất có thể")
  res.redirect("back")
}