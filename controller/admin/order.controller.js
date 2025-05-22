const Order = require("../../model/order.model")
const Product = require("../../model/product.model")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const filterStatusOrderHelper = require("../../helpers/filterStatusOrder")


module.exports.index = async (req, res) => {
  const filterStatus = req.query.status;

  // filter Date
  let {startDate, endDate } = req.query;

  const dateRegex = /^(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{4}$/;
  let checkDate = false;

  if (startDate && endDate && dateRegex.test(startDate) && dateRegex.test(endDate)) { 
    const parseDate = (str) => {
      const month = parseInt(str.slice(0, 2)) - 1;
      const day = parseInt(str.slice(2, 4));
      const year = parseInt(str.slice(4, 8));
      return new Date(year, month, day);
    };
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (end >= start) {
      checkDate = true;
    }
    else{
      req.flash('error', 'End date must be greater than start date');
      return res.redirect("/admin/orders");
    }
  }

  if (checkDate) {
    const parseDate = (str) => {
      const month = parseInt(str.slice(0, 2)) - 1;
      const day = parseInt(str.slice(2, 4));
      const year = parseInt(str.slice(4, 8));
      return new Date(year, month, day);
    };
    startDate = parseDate(startDate);
    endDate = parseDate(endDate);
    startDate = startDate.setHours(0, 0, 0, 0);
    endDate = endDate.setHours(23, 59, 59, 999);
  }
  // end filter date
  
  let find = {
    ...(filterStatus && {deliveryStatus: filterStatus}),
    ...(checkDate && {createdAt: {$gte: new Date(startDate), $lte: new Date(endDate)}})
  }

  //search
  const keySearch = req.query.keyword;
  if (keySearch){
    find = {
      ...find,
      $or: [
        { 'userInfo.fullName': new RegExp(keySearch, "i") },
        { orderId: new RegExp(keySearch, "i") }
      ]
    }
  }

  //pagination
  const [totalOrder, currentPage, limit] = [await Order.countDocuments(find), 1, 6]
  const objectPagination = paginationHelper(req, totalOrder, currentPage, limit)

  const orders = await Order.aggregate([
    {
      $match: find
    },
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
      $sort: {
        createdAt: -1
      }
    },
    {
      $skip: objectPagination.skip
    },
    {
      $limit: objectPagination.limit
    }
  ])

  const fiterStatusOrder = filterStatusOrderHelper(req.query);

  console.log(objectPagination);
  res.render("admin/pages/orders/index", {
    pageTitle: "Order Management",
    orders, pagination: objectPagination , fiterStatusOrder, keySearch
  })
}
module.exports.changeStatus = async (req, res) => {
  try {
    await Order.updateOne({_id: req.params.orderId }, { deliveryStatus: req.params.value });
    if(req.params.value=="delivered"){
      await Order.updateOne({_id: req.params.orderId }, 
        { paymentStatus: { status: "ok", lack: 0 } }
      );
    }
    req.flash('success', 'Change status order successfully');
    res.redirect("back");
  } catch (error) {
    req.flash('error', 'Change status order failed');
    res.redirect("back");
  }
}


