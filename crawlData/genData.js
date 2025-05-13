import genDataUser from "./Action/gen/genDataUser.js";
import { readJson, writeJson } from "./Action/fileHandle.js";
import { connect } from "./config/database.js";
import User from "./model/user.model.js";
import genDataOrder from "./Action/gen/genDataOrder.js";
import Order from "./model/order.model.js";
import OrderProduct from "./model/order-product.model.js";
import genDataFeedback from "./Action/gen/genDataFeedback.js";
import ProductFeedback from "./model/product-feedback.model.js";

const userAction = async () => {
  const year = 2025;
  const strMonth = 1;
  const endMonth = 4;
  for (let i = strMonth; i <= endMonth; i++) {
    const month = i < 10 ? `0${i}` : `${i}`;
    const yearMonth = `${year}-${month}`;
    const users = await genDataUser(yearMonth);
    await writeJson(`./DataFakeGen/Customer/${yearMonth}.json`, users);

    const usersRead = await readJson(`./DataFakeGen/Customer/${yearMonth}.json`);
    for (const user of usersRead) {
      const newUser = new User(user);
      await newUser.save();
    }
    console.log("User data inserted successfully!");
  }

}

const orderAction = async () => {
  const year = 2025;
  const strMonth = 1;
  const endMonth = 4;
  for (let i = strMonth; i <= endMonth; i++) {
    const month = i < 10 ? `0${i}` : `${i}`;
    const yearMonth = `${year}-${month}`;
    const orders = await genDataOrder(yearMonth);
    await writeJson(`./DataFakeGen/Order/${yearMonth}.json`, orders);
    // const ordersRead = await readJson("./DataFakeGen/Order/T4.json");
    // for (const order of ordersRead) {
    //   const newOrder = new Order(order);
    //   await newOrder.save();
    //   for (const item of order.orderProducts) {
    //     item.createdAt = order.createdAt;
    //     const orderProduct = new OrderProduct(item);
    //     await orderProduct.save();
    //   }
    // }
    // console.log("Order data inserted successfully!");
  }
}


const ProductFeedbackAction = async () => {
  const year = 2025;
  const strMonth = 1;
  const endMonth = 4;
  for (let i = strMonth; i <= endMonth; i++) {
    const month = i < 10 ? `0${i}` : `${i}`;
    const yearMonth = `${year}-${month}`;
    const feedbacks = await genDataFeedback(yearMonth);
    await writeJson(`./DataFakeGen/Product-Feedback/${yearMonth}.json`, feedbacks);

    // const feedbacksRead = await readJson(`./DataFakeGen/Product-Feedback/${yearMonth}.json`);
    // for (const feedback of feedbacksRead) {
    //   const newFeedback = new ProductFeedback(feedback);
    //   await newFeedback.save();
    // }
    // console.log("Product feedback data inserted successfully!");
  }
}

const main = async () => {
  await connect();
  // await userAction();
  // await orderAction();
  await ProductFeedbackAction();

}
main();