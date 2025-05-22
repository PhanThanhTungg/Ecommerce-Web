const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const Feedback = require("../../model/product-feedback.model");
module.exports.index = async (req, res) => {
  const cartId = res.locals.miniCart.id;
  const cart = await Cart.findOne({
    _id: cartId
  }).lean();

  cart.totalPrice = 0;
  cart.totalQuantity = 0;

  let listCategory = [];

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id
      }).select("images thumbnail title slug listSize discountPercentage product_category_id")

      const sizeInfo = product.listSize.find(i => {
        return i.id == item.sizeId
      })

      sizeInfo.priceNew = (sizeInfo.price * (100 - product.discountPercentage) / 100).toFixed(0)

      item.sizeInfo = sizeInfo
      item.productInfo = product

      listCategory.push(product.product_category_id)

      item.totalPrice = item.quantity * sizeInfo.priceNew

      cart.totalPrice += item.totalPrice
      cart.totalQuantity += item.quantity
    }
  }

  const relatedProducts = await Product.find({
    product_category_id: { $in: listCategory },
    status: "active",
    deleted: false
  }).sort({ sales: "desc" });

  for (const item of relatedProducts) {
    const feedbacksFound = await Feedback.find({
      productId: item._id,
    })
    const averageRating = Math.round(feedbacksFound.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacksFound.length);
    item.ratingNumber = averageRating;
    for (const size of item.listSize) {
      size.priceNew = (size.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }



  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
    relatedProducts: relatedProducts
  })
}

module.exports.addPost = async (req, res) => {
  const productId = req.params.productId
  const sizeId = req.body.sizeId
  const quantity = parseInt(req.body.quantity)
  const cartId = res.locals.miniCart.id;
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
  const cartId = res.locals.miniCart.id;
  const productId = req.params.productId
  const sizeId = req.params.sizeId


  await Cart.updateOne({
    _id: cartId
  }, {
    $pull: { products: { product_id: productId, sizeId: sizeId } }  //$pull: xóa đi
  })

  const cart = await Cart.findOne({ _id: cartId });
  let totalPrice = 0;
  for (const product of cart.products) {
    const productItem = await Product.findOne({ _id: product.product_id });
    const size = productItem.listSize.find(item => item.id == product.sizeId);
    totalPrice += +(size.price * (100 - productItem.discountPercentage) / 100).toFixed(0) * product.quantity;
  }

  res.json({
    code: 200,
    mess: "delete successfully",
    totalPrice,
    totalItem: cart.products.length
  })
}


module.exports.update = async (req, res) => {
  const cartId = res.locals.miniCart.id;
  const productId = req.params.productId
  let quantity = req.params.quantity
  const sizeId = req.params.sizeId

  const productItem = await Product.findOne({ _id: productId });
  const size = productItem.listSize.find(item => item.id == sizeId);
  quantity = Math.max(1, quantity);
  quantity = Math.min(quantity, size.stock);


  await Cart.updateOne({
    _id: cartId,
    "products.product_id": productId,
    "products.sizeId": sizeId
  }, {
    $set: { "products.$.quantity": quantity }
  });

  const cart = await Cart.findOne({ _id: cartId });
  let totalPrice = 0;
  for (const product of cart.products) {
    const productItem = await Product.findOne({ _id: product.product_id });
    const size = productItem.listSize.find(item => item.id == product.sizeId);
    totalPrice += +(size.price * (100 - productItem.discountPercentage) / 100).toFixed(0) * product.quantity;
  }

  res.json({
    totalPrice,
    code: 200,
    mess: "update cart successfully",
    totalItem: cart.products.length
  })
}