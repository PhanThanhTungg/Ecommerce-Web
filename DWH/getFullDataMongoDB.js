const User = require("../model/user.model.js");
const Product = require("../model/product.model.js");
const ProductFeedback = require("../model/product-feedback.model.js");
const Category = require("../model/product-category.model.js");
const Order = require("../model/order.model.js");
const OrderProduct = require("../model/order-product.model.js");

module.exports = async(startTime, endTime) => {
  try {
    const users = await User.find({ createdAt: { $gte: startTime, $lte: endTime } });
    const products = await Product.find({ createdAt: { $gte: startTime, $lte: endTime } });
    const productFeedbacks = await ProductFeedback.find({ createdAt: { $gte: startTime, $lte: endTime } });
    const categories = await Category.find({ createdAt: { $gte: startTime, $lte: endTime } });
    const orders = await Order.find({ createdAt: { $gte: startTime, $lte: endTime } });
    const orderProducts = await OrderProduct.find({ createdAt: { $gte: startTime, $lte: endTime } });

    return {
      users,
      products,
      productFeedbacks,
      categories,
      orders,
      orderProducts,
    };
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }
}