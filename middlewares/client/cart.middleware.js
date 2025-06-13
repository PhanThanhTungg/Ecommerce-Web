const Cart = require("../../model/cart.model");
const User = require("../../model/user.model");

module.exports.cartId = async (req, res, next) => {
  let cart;
  if(res.locals.user){
    const cartItem = await Cart.findOne({user_id: res.locals.user.id});
    if(cartItem){
      cart = cartItem;
    }
    else{
      const cartItem = new Cart({user_id: res.locals.user.id});
      await cartItem.save();
      cart = cartItem;
    }
  }
  else{
    const cartId = req.cookies.cartId
    if(cartId){
      const cartItem = await Cart.findOne({_id: cartId});
      if(cartItem) cart = cartItem;
      else{
        res.clearCookie('cartId');
        return res.redirect("/");
      }
    }
    else{
      const cartItem = new Cart();
      await cartItem.save();
      cart = cartItem;
      res.cookie("cartId", cart.id,{httpOnly: true, maxAge:7 * 24 * 60 * 60 * 1000})
    }
  }
  if(cart){
    const totalQuantity = cart.products.length;
    cart.totalQuantity = totalQuantity
    res.locals.miniCart = cart;
  }
  next();
}