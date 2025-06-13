const Order = require("../../model/order.model")
const Product = require("../../model/product.model");
const OrderProduct = require("../../model/order-product.model");
const getStatusHelper = require("../../helpers/getStatus.helper");
const filterStatusOrderHelper = require("../../helpers/filterStatusOrder")
const searchHelper = require("../../helpers/search")
module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const query = user ? { userId: user.id } : { cartId: req.cookies.cartId };
  const queryDeliveryStatus = req.query.deliveryStatus;
  if(queryDeliveryStatus) {
    query.deliveryStatus = queryDeliveryStatus;
  }

  let orders = await Order.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $addFields: { id: { $toString: "$_id" } } },
    {
      $lookup: {
        from: "order-product",
        localField: "id",
        foreignField: "order_id",
        as: "orderProducts"
      }
    },
  ]);

  if (!orders) {
    req.flash("error", "Có lỗi");
    return res.redirect("/");
  }

  for(const order of orders) {
    for(const item of order.orderProducts) {
      const product = await Product.findOne({ _id: item.product_id }).select("images");
      item.thumbnail = product.images[0];
    }
  }


  res.render("client/pages/order/index", {
    pageTitle: "History",
    orders: orders,
    bankId: process.env.QR_BANK_ID,
    bankAccount: process.env.QR_BANK_ACC
  })
}

module.exports.deleteItem = async (req, res) => {
  const orderId = req.params.id
  const objectId = req.params.objectId

  const order = await Order.findOne({
    _id: objectId
  })

  let listProduct
  if (order.products.length > 0) {
    listProduct = order.products
    for (const item of order.products) {
      if (orderId == item.id) {
        item.status = "daHuy"
        const infoProduct = await Product.findOne({
          _id: item.product_id
        })

        const sizeInfo = infoProduct.listSize.find(i => {
          return i.id == item.size_id
        })

        const currentStock = sizeInfo.stock + item.quantity
        await Product.updateOne({ _id: item.product_id }, {
          sales: infoProduct.sales - item.quantity
        })

        await Product.updateOne({
          _id: item.product_id,
          "listSize._id": sizeInfo._id
        }, {
          $set: {
            "listSize.$.stock": currentStock
          }
        })
      }
    }
  }
  await Order.updateOne({ _id: objectId }, { products: listProduct })
  res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

