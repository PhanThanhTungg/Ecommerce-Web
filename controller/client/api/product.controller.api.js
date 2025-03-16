const Category = require("../../../model/product-category.model");
const Product = require("../../../model/product.model");
const paginationHelper = require("../../../helpers/pagination")
module.exports.productApiGetData = async (req, res) => {
  try {
    let find = { status: "active", deleted: false };
    if (req.params.slugCategory) {
      const slugCategory = req.params.slugCategory;
      const category = await Category.findOne({
        slug: slugCategory,
        status: "active",
        deleted: false
      });
      const getSubCategory = async (parentId) => {
        const subs = await Category.find({
          parent_id: parentId,
          status: "active",
          deleted: false
        });

        let allSubs = [...subs];

        for (const sub of subs) {
          const childs = await getSubCategory(sub.id);
          allSubs = allSubs.concat(childs);
        }

        return allSubs;
      }

      const allCagegory = await getSubCategory(category.id);

      const allCagegoryId = allCagegory.map(item => item.id);
      find.product_category_id = {
        $in: [
          category.id,
          ...allCagegoryId
        ]
      }
    }

    // //check availability
    // const availability = req.query.availability;
    // if (availability == "inStock") {
    //   find["listSize.stock"] = { $gt: 0 };
    // }
    // else if (availability == "outOfStock") {
    //   find["$expr"] = { $eq: [{ $sum: "$listSize.stock" }, 0] };
    // }

    // //check range of price
    // const [priceBegin, priceEnd] = [req.query.priceBegin, req.query.priceEnd]
    // if(priceBegin && priceEnd){
    //   find["$expr"] = {
    //     "$and": [
    //       { "$gte": [{ "$arrayElemAt": ["$listSize.price", 0] }, priceBegin] },
    //       { "$lte": [{ "$arrayElemAt": ["$listSize.price", 0] }, priceEnd] }
    //     ]
    //   }
    // }

    let exprConditions = [];

    // Check availability
    const availability = req.query.availability;
    if (availability == "inStock") {
      find["listSize.stock"] = { $gt: 0 };
    } else if (availability == "outOfStock") {
      exprConditions.push({ $eq: [{ $sum: "$listSize.stock" }, 0] });
    }

    // Check range of price
    const [priceBegin, priceEnd] = [req.query.priceBegin, req.query.priceEnd];
    if (priceBegin && priceEnd) {
      exprConditions.push(
        { "$gte": [{ "$arrayElemAt": ["$listSize.price", 0] }, Number(priceBegin)] },
        { "$lte": [{ "$arrayElemAt": ["$listSize.price", 0] }, Number(priceEnd)] }
      );
    }

    if (exprConditions.length > 0) {
      find["$expr"] = { "$and": exprConditions };
    }

    //sort
    let sort = {}
    let sortPrice;
    const [sortBy, sortValue] = [req.query.sortBy, req.query.sortValue];

    if (sortBy && sortValue) {
      sort[sortBy] = sortValue === "asc" ? 1 : -1;
      if (sortBy === "price") {
        sortPrice = (sortValue == "desc" ? -1 : 1);
      }
    }
    else if (sortBy && !sortValue) {
      if (sortBy == 'featured') {
        find.featured = "1";
        sort.position = 1;
      }
      else if (sortBy == 'best_selling') {
        sort["sales"] = -1;
      }
    }
    else {
      sort.position = 1;
    }
    //end sort

    //Pagigation
    let objectPagination = await paginationHelper(req, await Product.countDocuments(find), 1, Number(req.query.limit) || 9);
    //End pagigation
    console.log(objectPagination)

    const pipeline = [
      { $match: find },
      { $addFields: { firstPrice: { $arrayElemAt: ["$listSize.price", 0] } } },
      { $sort: sortBy !== "price" ? sort : { firstPrice: sortPrice } },
      { $skip: objectPagination.skip },
      { $limit: objectPagination.limit }
    ];

    const newProducts = await Product.aggregate(pipeline);
    console.log(newProducts.length)

    for (const item of newProducts) {
      for (const size of item.listSize) {
        size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
      }
    }
    res.json({
      products: newProducts,
      objectPagination: objectPagination
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "error!",
      detail_message: error
    })
  }
}