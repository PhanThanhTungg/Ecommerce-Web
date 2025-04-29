const Order = require("../../model/order.model")
const Product = require("../../model/product.model")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const filterStatusOrderHelper = require("../../helpers/filterStatusOrder")


module.exports.index = async (req, res) => {

  const [totalOrder, currentPage, limit] = [await Order.countDocuments(), 1, 6]
  const objectPagination = await paginationHelper(req, totalOrder, currentPage, limit)

  const orders = await Order.aggregate([
    {
      $addFields: {
        "id": { $toString: "$_id" },
        "_user_id": { $toObjectId: "$userId" }
      }
    },
    {
      $lookup: {
        from: "order-product",
        localField: "id",
        foreignField: "order_id",
        as: "products"
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "_user_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $skip: objectPagination.skip
    },
    {
      $limit: objectPagination.limit
    }
  ])

  res.render("admin/pages/orders/index", {
    pageTitle: "Order Management",
    orders, objectPagination
  })
}
module.exports.changeStatus = async (req, res) => {
  try {
    await Order.updateOne({_id: req.params.orderId }, { deliveryStatus: req.params.value });
    req.flash('success', 'Change status order successfully');
    res.redirect("back");
  } catch (error) {
    req.flash('error', 'Change status order failed');
    res.redirect("back");
  }
}


