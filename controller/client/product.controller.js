const Product = require("../../model/product.model")
const ProductCategory = require("../../model/product-category.model")
const paginationHelper = require("../../helpers/pagination")

module.exports.index = async (req, res) => {

  const find = {
    status: "active",
    deleted: false
  }
  //sort
  let sort = {}
  let sortPrice;
  const [sortKey, sortValue] = [req.query.sortKey, req.query.sortValue];
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue === "asc" ? 1 : -1;
    if (sortKey === "price") {
      sortPrice = (sortValue == "desc" ? -1 : 1);
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
    { $sort: sortKey !== "price" ? sort : { firstPrice: sortPrice } },
    { $skip: objectPagination.skip },
    { $limit: objectPagination.limit }
  ];

  const products = await Product.aggregate(pipeline);

  for (const item of products) {
    for (const size of item.listSize) {
      size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }

  if (req.query.sortKey == "price") {
    products.sort((a, b) => {
      if (req.query.sortValue == "desc") {
        if (a.listSize[0].priceNew < b.listSize[0].priceNew) return 1
        else return -1
      }
      else {
        if (a.listSize[0].priceNew < b.listSize[0].priceNew) return -1
        else return 1
      }
    })
  }


  res.render("client/pages/products/index.pug", {
    pageTitle: "TRANG SẢN PHẨM",
    Products: products,
    pagination: objectPagination
  })
}

module.exports.detail = async (req, res) => {
  try {
    const product = await Product.aggregate([
      { $match: { slug: req.params.slugProduct, deleted: false, status: "active" } },
      { $limit: 1 },
      {
        $addFields: {
          "_id_product_category": { $toObjectId: "$product_category_id" }
        }
      },
      {
        $lookup: {
          from: "product-feedback",
          localField: "_id",
          foreignField: "productId",
          as: "feedback"
        }
      },
      {
        $lookup: {
          from: "customers",
          pipeline: [ { $project: { fullName: 1, email: 1, thumbnail: 1 } } ],
          as: "SEARCH_OBJECTS"
        }
      },
      {
        $addFields: {
          "feedback": {
            $map: {
              input: { 
                $sortArray: { 
                  input: "$feedback", 
                  sortBy: { "createdAt": -1 } 
                }
              },
              as: "feedbackItem",
              in: {
                $mergeObjects: [
                  "$$feedbackItem",
                  {
                    userDetail: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$SEARCH_OBJECTS",
                            as: "user",
                            cond: { $eq: ["$$user._id", "$$feedbackItem.userId"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "categorys",
          localField: "_id_product_category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $addFields: {
          categoryTitle: { $ifNull: [{ $arrayElemAt: ["$category.title", 0] }, ""] },
          categorySlug: { $ifNull: [{ $arrayElemAt: ["$category.slug", 0] }, ""] },
        }
      },
      {
        $addFields: {
          "listSize": {
            $map: {
              input: "$listSize",
              as: "size",
              in: {
                _id: "$$size._id",
                size: "$$size.size",
                price: "$$size.price",
                stock: "$$size.stock",
                priceNew: {
                  $toString: {
                    $floor: {
                      $multiply: [
                        "$$size.price",
                        { $divide: [{ $subtract: [100, "$discountPercentage"] }, 100] }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          category: 0, _id_product_category: 0, id_string: 0,
          createdAt: 0, updatedAt: 0, updatedBy: 0, deleted: 0, __v: 0,
          createBy: 0, position: 0, SEARCH_OBJECTS: 0
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $eq: [{ $size: "$feedback" }, 0] },
              then: 0,
              else: { $avg: "$feedback.rating" }
            }
          },
          totalReviews: { $size: "$feedback" }
        }
      },
      {
        $addFields: {
          starCounts: {
            oneStar: {
              $size: {
                $filter: {
                  input: "$feedback",
                  as: "item",
                  cond: { $eq: ["$$item.rating", 1] }
                }
              }
            },
            twoStars: {
              $size: {
                $filter: {
                  input: "$feedback",
                  as: "item",
                  cond: { $eq: ["$$item.rating", 2] }
                }
              }
            },
            threeStars: {
              $size: {
                $filter: {
                  input: "$feedback",
                  as: "item",
                  cond: { $eq: ["$$item.rating", 3] }
                }
              }
            },
            fourStars: {
              $size: {
                $filter: {
                  input: "$feedback",
                  as: "item",
                  cond: { $eq: ["$$item.rating", 4] }
                }
              }
            },
            fiveStars: {
              $size: {
                $filter: {
                  input: "$feedback",
                  as: "item",
                  cond: { $eq: ["$$item.rating", 5] }
                }
              }
            }
          }
        }
      }
    ]);

    if (product.length == 0) {
      return res.redirect("/products")
    }

    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product[0],
    })
  } catch (error) {
    console.log(error)
    res.redirect(`/products`)
  }
}

module.exports.category = async (req, res) => {
  //sort
  let sort = {}

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }
  else {
    sort.position = "desc"
  }
  //end sort
  const slugCategory = req.params.slugCategory;


  const category = await ProductCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false
  });
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
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
  const find = {
    product_category_id: {
      $in: [
        category.id,
        ...allCagegoryId
      ]
    },
    status: "active",
    deleted: false
  }

  //Pagigation
  let objectPagination = await paginationHelper(req, await Product.countDocuments(find), 1, 12);
  //End pagigation

  const products = await Product.find(find).sort(sort).limit(objectPagination.limit).skip(objectPagination.skip);

  for (const item of products) {
    for (const size of item.listSize) {
      size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }


  res.render("client/pages/products/index", {
    pageTitle: category.title,
    Products: products,
    pagination: objectPagination
  });

}


