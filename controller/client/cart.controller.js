const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
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

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart
  })
}

module.exports.addPost = async (req, res) => {
  const productId = req.params.productId
  const sizeId = req.body.sizeId
  const quantity = parseInt(req.body.quantity)
  const cartId = req.cookies.cartId


  try {
    const cart = await Cart.findOne({
      _id: cartId
    })

    const existProductInCart = cart.products.find(item => {
      return item.product_id == productId && item.sizeId == sizeId
    });

    if (existProductInCart) {
      const quantityNew = existProductInCart.quantity + quantity;

      await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId,
        "products.sizeId": sizeId
      }, {
        $set: {
          "products.$.quantity": quantityNew
        }
      })
    } else {

      const objectCart = {
        product_id: productId,
        sizeId: sizeId,
        quantity: quantity
      }

      await Cart.updateOne({
        _id: cartId
      }, {
        $push: {
          products: objectCart
        },
      })
    }

    req.flash("success", `Đã thêm sản phẩm vào giỏ hàng!`)
  } catch (error) {
    req.flash("error", `Thêm sản phẩm vào giỏ hàng không thành công!`)
  }

  res.redirect("back")
}

module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId
  const productId = req.params.productId
  const sizeId = req.params.sizeId


  await Cart.updateOne({
    _id: cartId
  }, {
    $pull: { products: { product_id: productId, sizeId: sizeId} }  //$pull: xóa đi
  })

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!")

  res.redirect("back")
}


module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId
  const productId = req.params.productId
  const quantity = req.params.quantity
  const sizeId = req.params.sizeId

  await Cart.updateOne({
    _id: cartId,
    "products.product_id": productId,
    "products.sizeId": sizeId
  }, {
    $set: { "products.$.quantity": quantity }
  });

  req.flash("success", "Cập nhật số lượng thành công!");

  res.redirect("back");
}