const Category = require("../../../model/product-category.model");
const Product = require("../../../model/product.model");
const Feedback = require("../../../model/product-feedback.model")
const paginationHelper = require("../../../helpers/pagination")
const unidecode = require("unidecode");

module.exports.productApiSearch = async (req, res) => {
  try {
    let keyword = req.params.keyword.toString().trim();
    let key = keyword.replace(/\s+/g, "-");
    key = unidecode(key);
    const regex = new RegExp(key, "i");
    const products = await Product.find({
      slug: regex,
      status: "active",
      deleted: false
    }).select("title")
    res.status(200).json({
      message: "success",
      data: products
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      detail_message: error
    })
  }
}

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
    const count = await Product.countDocuments(find);
    console.log(find);

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

    console.log(newProducts);
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

module.exports.productApiGettype = async (req, res) => {
  try {
    let find = { status: "active", deleted: false };
    const type = req.params.type;
    let products;
    let sort = {}
    switch (type) {
      case "featured":
        find.featured = "1";
        break;
      case "saleoff":
        find.discountPercentage = { $gt: 0 };
        sort.discountPercentage = "desc";
        break;
      case "sales":
        sort.sales = "desc"
    }

    //Pagigation
    let objectPagination = await paginationHelper(req, await Product.countDocuments(find), 1, Number(req.query.limit) || 8);

    products = await Product.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limit)
      .select("title listSize discountPercentage images ratingNumber sales featured slug");
    res.status(200).json({
      products: products,
      objectPagination
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "error!",
      detail_message: error
    })
  }
}

module.exports.productApiAddFeedback = async (req, res) => {
  try {
    if (!res.locals.user) {
      return res.json({
        code: 401,
        message: "unauthorized!"
      })
    }
    const data = {
      productId: req.body.productId,
      userId: res.locals.user.id,
      rating: +req.body.rating,
      comment: req.body.comment,
    }
    const feedback = new Feedback(data);
    await feedback.save();

    res.json({
      code: 200,
      message: "Feedback added successfully",
      data: feedback,
    });

  } catch (error) {
    res.json({
      code: 400,
      error
    })
  }
}

