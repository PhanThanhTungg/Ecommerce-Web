import genDataUser from "./Action/gen/genDataUser.js";
import { readJson, writeJson } from "./Action/fileHandle.js";
import {connect } from "./config/database.js";
import User from "./model/user.model.js";
import genDataOrder from "./Action/gen/genDataOrder.js";
import Order from "./model/order.model.js";
import OrderProduct from "./model/order-product.model.js";
import genDataFeedback from "./Action/gen/genDataFeedback.js";
import ProductFeedback from "./model/product-feedback.model.js";

const userAction = async ()=>{
  const users =  await genDataUser();
  await writeJson("./DataFakeGen/Customer/T4.json", users);

  const usersRead = await readJson("./DataFakeGen/Customer/T4.json");
  for(const user of usersRead){
    const newUser = new User(user);
    await newUser.save();
  }
  console.log("User data inserted successfully!");
}

const orderAction = async ()=>{
  const orders = await genDataOrder();
  await writeJson("./DataFakeGen/Order/T4.json", orders);

  const ordersRead = await readJson("./DataFakeGen/Order/T4.json");
  for(const order of ordersRead){
    const newOrder = new Order(order);
    await newOrder.save();
    for(const item of order.orderProducts){
      item.createdAt = order.createdAt;
      const orderProduct = new OrderProduct(item);
      await orderProduct.save();
    }
  }
  console.log("Order data inserted successfully!");
}


const ProductFeedbackAction = async()=>{
  const feedbacks = await genDataFeedback();
  await writeJson("./DataFakeGen/Product-Feedback/T4.json", feedbacks);

  const feedbacksRead = await readJson("./DataFakeGen/Product-Feedback/T4.json");
  for(const feedback of feedbacksRead){
    const newFeedback = new ProductFeedback(feedback);
    await newFeedback.save();
  }
  console.log("Product feedback data inserted successfully!");
}

const main = async()=>{
  await connect();
  // await userAction(); 
  // await orderAction();
  await ProductFeedbackAction();

}
main();