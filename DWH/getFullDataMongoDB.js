const ProductFeedback = require("../model/product-feedback.model.js");
const Order = require("../model/order.model.js");
const OrderProduct = require("../model/order-product.model.js");

module.exports = async(startTime, endTime) => {
  try {
    const productFeedbacks = await ProductFeedback.find({ createdAt: { $gte: startTime, $lte: endTime } }).lean();
    const orders = await Order.find({ createdAt: { $gte: startTime, $lte: endTime } }).lean();
    const orderProducts = await OrderProduct.find({ createdAt: { $gte: startTime, $lte: endTime } }).lean();

    return {
      productFeedbacks,
      orders,
      orderProducts,
    };
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }
}