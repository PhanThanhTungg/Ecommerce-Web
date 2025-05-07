const { CronJob } = require('cron');
const getFullDataMongoDB = require('./getFullDataMongoDB');
const sequelize = require('./connectToMSSQL');

const Category = require('../model/product-category.model.js');
const User = require("../model/user.model.js");
const Product = require("../model/product.model.js");
const Order = require("../model/order.model.js");
const OrderProduct = require("../model/order-product.model.js");

const Dim_Time = require("./modelWH/Dim_Time.model.js");
const Dim_Category = require("./modelWH/Dim_Category.model.js");
const Dim_Customer = require("./modelWH/Dim_Customer.model.js");
const Dim_Product = require("./modelWH/Dim_Product.model.js");
const Dim_Location = require("./modelWH/Dim_Location.model.js");
const Dim_Order = require("./modelWH/Dim_Order.model.js");
const Fact_Order = require("./modelWH/Fact_Order.model.js");
const Fact_Sale = require("./modelWH/Fact_Sale.model.js");
const Fact_Feedback = require("./modelWH/Fact_Feedback.model.js");

module.exports = async () => {
  // const job = new CronJob(
  //   '59 23 * * *', 
  //   function () {
  //     console.log('Bạn sẽ thấy thông báo này lúc 16h19 hàng ngày theo giờ Việt Nam');
  //   },
  //   null,
  //   true,
  //   'Asia/Ho_Chi_Minh'
  // );
  // const month = "04";
  // const t = await sequelize.transaction();

  // try {
  //   const customers = await User.find({});
  //   for (const customer of customers) {
  //     const DimCustomer = await Dim_Customer.upsert({
  //       Customer_key: customer._id.toString(),
  //       Customer_name: customer.fullName,
  //       Gender: customer.sex ? customer.sex : 'Unknown',
  //       Type: customer.facebookId ? 'Facebook' : customer.googleId ? 'Google' : customer.githubId ? 'Github' : 'Normal',
  //     }, { transaction: t });
  //   }
  //   const categories = await Category.find({});
  //   for (const category of categories) {
  //     const DimCategory = await Dim_Category.upsert({
  //       Category_key: category._id.toString(),
  //       Category_name: category.title,
  //       Category_parent_key: category.parent_id ? category.parent_id.toString() : null,
  //       Featured: category.featured
  //     }, { transaction: t });
  //   }

  //   const products = await Product.find({});
  //   for (const product of products) {
  //     const DimProduct = await Dim_Product.upsert({
  //       Product_key: product._id.toString(),
  //       Category_key: product.product_category_id.toString(),
  //       Product_name: product.title,
  //       Featured: product.featured,
  //       Position: product.position,
  //     }, { transaction: t });
  //   }

  //   for (let date = 1; date <= 30; date++) {
  //     if (date < 10) date = "0" + ("" + date);
  //     const startTime = new Date(`2025-${month}-${date}T00:00:00+07:00`);
  //     const endTime = new Date(`2025-${month}-${date}T23:59:59+07:00`);
  //     const fullData = await getFullDataMongoDB(startTime, endTime);
  //     const DimTime = await Dim_Time.create({
  //       Time_key: startTime.toISOString(),
  //       Day: startTime.getDate(),
  //       Month: startTime.getMonth() + 1,
  //       Year: startTime.getFullYear(),
  //     }, { transaction: t });

  //     const orders = fullData.orders;
  //     for (const order of orders) {
  //       const DimLocation = await Dim_Location.create({
  //         Location_key: new Date().toISOString(),
  //         Province: order.userInfo.province.toString().trim().toLowerCase(),
  //         District: order.userInfo.district.toString().trim().toLowerCase(),
  //         Commune: order.userInfo.commune.toString().trim().toLowerCase(),
  //         Detail: order.userInfo.detail.toString().trim().toLowerCase(),
  //       }, { transaction: t })
  //       const DimOrder = await Dim_Order.create({
  //         Order_key: order._id.toString(),
  //         Delivery_method: order.deliveryMethod.toString().trim().toLowerCase(),
  //         Payment_method: order.paymentMethod.toString().trim().toLowerCase(),
  //         Status: order.paymentStatus ? order.paymentStatus.status.toString().trim().toLowerCase() : null,
  //       }, { transaction: t })
  //       const totalProduct = await OrderProduct.find({ order_id: order.id }).countDocuments();
  //       const FactOrder = await Fact_Order.create({
  //         Order_key: order._id.toString(),
  //         Customer_key: order.userId,
  //         Location_key: DimLocation.Location_key,
  //         Time_key: DimTime.Time_key,
  //         Total_qty_product: totalProduct,
  //         Shipping_fee: order.shippingFee,
  //         Total_price: order.totalProductPrice,
  //       }, { transaction: t })

  //       const factOrderObj = FactOrder.get({ plain: true }); // Chuyển thành object JS
  //       order.factOrderObj = factOrderObj;
  //     }

  //     const orderProducts = fullData.orderProducts;
  //     for (const orderProduct of orderProducts) {
  //       const orderFind = orders.find(item => item._id.toString() === orderProduct.order_id);
  //       console.log('OrderFind:', orderFind);
  //       const FactSale = await Fact_Sale.upsert({
  //         Customer_key: orderFind.factOrderObj.Customer_key,
  //         Product_key: orderProduct.product_id,
  //         Location_key: orderFind.factOrderObj.Location_key,
  //         Time_key: DimTime.Time_key,
  //         Quantity: orderProduct.quantity,
  //         Discount_percent: orderProduct.discountPercentage,
  //         Revenue: Math.round(orderProduct.price * (1 - orderProduct.discountPercentage / 100)) * orderProduct.quantity,
  //       }, { transaction: t });
  //     }

  //     const feedbacks = fullData.productFeedbacks;
  //     if (feedbacks.length > 0) {
  //       for (const feedback of feedbacks) {
  //         const FactFeedback = await Fact_Feedback.create({
  //           Feedback_key: feedback._id.toString(),
  //           Product_key: feedback.productId.toString(),
  //           Customer_key: feedback.userId.toString(),
  //           Time_key: DimTime.Time_key,
  //           Rating: feedback.rating,
  //         }, { transaction: t });
  //       }
  //     }
  //   }
  //   await t.commit();
  //   console.log('Data inserted to DWH successfully!');
  // } catch (error) {
  //   console.error('Error inserting data to DWH:', error);
  //   await t.rollback();
  // }
}