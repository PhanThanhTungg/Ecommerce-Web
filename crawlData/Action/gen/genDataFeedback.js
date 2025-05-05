import { faker } from '@faker-js/faker';
import { readJson } from "../../Action/fileHandle.js";
export default async () => {

  const orders = await readJson("./DataFakeGen/Order/T2.json");
  const orderProducts = orders.map(order => {
    let orderProducts = order.orderProducts;
    if (order.userId) {
      orderProducts = orderProducts.map(orderProduct => {
        return {
          ...orderProduct,
          user_id: order.userId,
          createdAt: order.createdAt
        }
      })
    }
    return orderProducts;
  }).flat();

  const feedbacks = [];
  for (const orderProduct of orderProducts) {
    const randomDays = Math.floor(Math.random() * 8) + 4;
    const baseDate = new Date(orderProduct.createdAt);

    const feedback = {
      productId: orderProduct.product_id,
      userId: orderProduct.user_id,
      rating: faker.helpers.weightedArrayElement([
        { value: 5, weight: 70 },
        { value: 4, weight: 15 },
        { value: 3, weight: 5 },
        { value: 2, weight: 10 },
        { value: 1, weight: 5 }
      ]),
      comment: faker.lorem.sentence(10),
      createdAt: new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000)
    }

    if (feedback.userId) feedbacks.push(feedback);
  }
  return feedbacks;
}