import { faker } from '@faker-js/faker';
import { readJson } from "../../Action/fileHandle.js";
export default async (yearMonth) => {

  const orders = await readJson(`./DataFakeGen/Order/${yearMonth}.json`);
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
    const randomDays = Math.floor(Math.random() * 6) + 3;
    const baseDate = new Date(orderProduct.createdAt);

    const feedback = {
      productId: orderProduct.product_id,
      userId: orderProduct.user_id,
      rating: faker.helpers.weightedArrayElement([
        { value: 5, weight: 60 },
        { value: 4, weight: 15 },
        { value: 3, weight: 10 },
        { value: 2, weight: 4 },
        { value: 1, weight: 6 }
      ]),
      comment: faker.lorem.sentence(10),
      createdAt: new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000)
    }

    if (feedback.userId) feedbacks.push(feedback);
  }
  return feedbacks;
}