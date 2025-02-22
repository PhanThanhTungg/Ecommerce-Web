const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const Order = require("../../model/order.model");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  cart.totalPrice = 0;

  if(cart.products.length > 0) {
    for (const item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id
      }).select("thumbnail title slug listSize discountPercentage")

      const sizeInfo = product.listSize.find(i=>{
        return i.id == item.sizeId
      })

      sizeInfo.priceNew = (sizeInfo.price * (100 - product.discountPercentage)/100).toFixed(0)

      item.sizeInfo = sizeInfo
      item.productInfo = product

      item.totalPrice = item.quantity * sizeInfo.priceNew

      cart.totalPrice += item.totalPrice
    }
  }


  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart
  });
};


module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId
  const userInfo = req.body

  const cart = await Cart.findOne({
    _id: cartId
  })


  const products = []

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      size_id: product.sizeId,
      quantity: product.quantity,
    }

    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("listSize discountPercentage")

    const sizeInfo = productInfo.listSize.find(i=>{
      return i.id == objectProduct.size_id
      
    })

    objectProduct.size = sizeInfo.size
    objectProduct.price= sizeInfo.price
    objectProduct.discountPercentage = productInfo.discountPercentage
    objectProduct.priceNew = (objectProduct.price * (100 - objectProduct.discountPercentage)/100).toFixed(0)

    products.push(objectProduct)
  }

  const orderInfo = {
    tokenUser: req.cookies.tokenUser,
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  }


  const order = new Order(orderInfo)
  order.save()

  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });

  res.redirect(`/checkout/success/${order.id}`)
}

module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId
  })
  var totalPrice = 0

  for (const product of order.products) {
    const infoProduct = await Product.findOne({
      _id: product.product_id
    })

    const sizeInfo = infoProduct.listSize.find(i=>{
      return i.id == product.size_id
    })

    product.sizeInfo = sizeInfo
    product.title = infoProduct.title
    product.thumbnail = infoProduct.thumbnail

    product.sizeInfo.priceNew = (product.sizeInfo.price * (100 - infoProduct.discountPercentage)/100).toFixed(0)

    product.totalPrice = product.sizeInfo.priceNew * product.quantity
    const currentStock = sizeInfo.stock-product.quantity
    await Product.updateOne({_id: product.product_id},{
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
  order.totalPrice = totalPrice

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order
  })
}