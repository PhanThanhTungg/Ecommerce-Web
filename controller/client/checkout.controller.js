const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const Order = require("../../model/order.model");
const OrderProduct = require("../../model/order-product.model")

module.exports.index = async (req, res) => {
  const orderProducts = [];
  if (!req.body.data) {
    req.flash("error", "Vui lòng chọn mặt hàng");
    return res.redirect("back");
  }
  const dataSplit = req.body.data.split(",");
  let totalPrice = 0;
  for (const item of dataSplit) {
    let [productId, sizeId, quantity] = item.split("-");
    quantity = +quantity;

    const product = await Product.findOne({
      _id: productId
    }).select("images title slug listSize discountPercentage")

    const size = product.listSize.find(i => i.id == sizeId)

    size.priceNew = (size.price * (100 - product.discountPercentage) / 100).toFixed(0)

    const totalPriceItem = quantity * size.priceNew

    totalPrice += totalPriceItem

    orderProducts.push({
      product,
      size,
      quantity,
      totalPriceItem
    })
  };
  console.log(totalPrice)
  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    orderProducts,
    totalPrice,
    bankId: process.env.QR_BANK_ID,
    bankAccount: process.env.QR_BANK_ACC
  });
};

module.exports.order = async (req, res) => {
  let { orderProducts, fullName, phone, province, district, commune, detail, paymentMethod } = req.body;
  orderProducts = JSON.parse(orderProducts);

  const orderData = {
    userInfo:{
      fullName,
      phone,
      province,
      district,
      commune,
      detail
    },
    deliveryStatus: "Pending",
    paymentMethod
  }

  if(res.locals.user) orderData.userId = res.locals.user.id;
  const order = new Order(orderData);
  await order.save();

  for(const item of orderProducts){
    const orderProduct = new OrderProduct({
      order_id: order.id,
      product_id: item.product._id,
      size_id: item.size._id,
      product_title: item.product.title,
      size: item.size.size,
      price: item.size.price,
      discountPercentage: item.product.discountPercentage,
      quantity: item.quantity,
    })
    await orderProduct.save();
  }

  res.redirect("/checkout/success/"+order.id)
}

module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId
  })

  if(!order){
    req.flash("Vui lòng tuân thủ theo các bước mua sắm");
    return res.redirect("/")
  }
  let totalPrice = 0

  const products = await OrderProduct.find({
    order_id: order.id
  })

  for (const product of products) {
    const infoProduct = await Product.findOne({
      _id: product.product_id
    })

    const sizeInfo = infoProduct.listSize.find(i => {
      return i.id == product.size_id
    })

    product.thumbnail = infoProduct.images[0];

    product.totalPrice = product.price * product.quantity
    const currentStock = sizeInfo.stock - product.quantity
    await Product.updateOne({ _id: product.product_id }, {
      sales: infoProduct.sales + product.quantity
    })

    await Product.updateOne({
      _id: product.product_id,
      "listSize._id": sizeInfo._id
    }, {
      $set: {
        "listSize.$.stock": currentStock
      }
    })

    totalPrice += product.totalPrice
  }
  
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    products,
    totalPrice
  })
  // res.redirect("/");
}