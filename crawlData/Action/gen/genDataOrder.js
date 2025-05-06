import Product from "../../model/product.model.js";
import User from "../../model/user.model.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { fetchDistrict, fetchProvince, fetchWard } from "../../helper/fetchLocation.js";

export default async () => {
  const listUserId = await User.find({}).select("_id").lean();

  const listProduct = await Product.find({}).select("_id title listSize._id listSize.size listSize.price discountPercentage").lean()

  const listProvince = await fetchProvince();
  const orders = [];
  for (let i = 0; i < 298; i++) {
    try {
      const order = {};
      // orderId
      order._id = new mongoose.Types.ObjectId();

      // cartId or userId
      
      const randomIndex = Math.floor(Math.random() * listUserId.length);
      order.userId = listUserId[randomIndex]._id.toString();
      

      //userInfo
      const userInfo = {
        fullName: faker.person.fullName(),
        phone: faker.phone.number()
      }
      const randomIndexProvince = Math.floor(Math.random() * listProvince.length);
      const province = listProvince[randomIndexProvince].name;
      userInfo.province = province;

      const listDistrict = await fetchDistrict(listProvince[randomIndexProvince].id);
      const randomIndexDistrict = Math.floor(Math.random() * listDistrict.length);
      const district = listDistrict[randomIndexDistrict].name;
      userInfo.district = district;

      const listWard = await fetchWard(listDistrict[randomIndexDistrict].id);
      const randomIndexWard = Math.floor(Math.random() * listWard.length);
      const commune = listWard[randomIndexWard].name;
      userInfo.commune = commune;

      userInfo.detail = faker.location.streetAddress();

      order.userInfo = userInfo;

      // order-product
      const orderProducts = [];
      const quantity = faker.helpers.weightedArrayElement([
        { value: 1, weight: 83 },
        { value: 2, weight: 7 },
        { value: 3, weight: 7 },
        { value: 4, weight: 3 },
      ]);
      for (let j = 0; j < quantity; j++) {
        const indexProduct = Math.floor(Math.random() * listProduct.length);
        const indexSize = Math.floor(Math.random() * listProduct[indexProduct].listSize.length);
        orderProducts.push({
          order_id: order._id.toString(),
          product_id: listProduct[indexProduct]._id.toString(),
          size_id: listProduct[indexProduct].listSize[indexSize]._id.toString(),
          product_title: listProduct[indexProduct].title,
          size: listProduct[indexProduct].listSize[indexSize].size,
          price: listProduct[indexProduct].listSize[indexSize].price,
          discountPercentage: listProduct[indexProduct].discountPercentage,
          quantity: faker.helpers.weightedArrayElement([
            { value: 1, weight: 83 },
            { value: 2, weight: 17 },
          ])
        })
      }
      order.orderProducts = orderProducts;

      // totalProductPrice
      const totalProductPrice = orderProducts.reduce((acc, item) => {
        const price = item.price - (item.price * item.discountPercentage) / 100;
        return acc + price * item.quantity;
      }, 0);
      order.totalProductPrice = totalProductPrice;

      // shippingFee
      let shippingFee = province !== "Hà Nội" ? 40000 : Math.floor(Math.random() * 10000) + 30000;
      if (totalProductPrice > 5000000) shippingFee = 0;
      order.shippingFee = shippingFee;

      // note
      order.note = faker.lorem.sentence(5);

      // deliveryMethod
      const deliveryMethod = faker.helpers.weightedArrayElement([
        { value: 'instant', weight: 65 },
        { value: 'standard', weight: 35 },
      ]);
      order.deliveryMethod = deliveryMethod;

      // deliveryStatus
      const deliveryStatus = faker.helpers.weightedArrayElement([
        { value: 'pending-payment', weight: 20 },
        { value: 'delivered', weight: 70 },
        { value: 'cancelled', weight: 15 },
      ]);
      order.deliveryStatus = deliveryStatus;

      // paymentStatus
      if (deliveryStatus === 'delivered') order.paymentStatus = { status: "ok" };
      else if (deliveryStatus === 'pending-payment') order.paymentStatus = { status: "lack", lack: totalProductPrice + shippingFee };

      // paymentMethod
      const paymentMethod = faker.helpers.weightedArrayElement([
        { value: 'momo', weight: 16 },
        { value: 'zalopay', weight: 4 },
        { value: 'cash', weight: 73 },
        { value: 'qr', weight: 7 },
      ]);
      order.paymentMethod = paymentMethod;

      // createdAt
      order.createdAt = order.createdAt = faker.date.between({ from: '2025-04-01', to: '2025-04-30' });

      orders.push(order);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Error: ", error);
      continue;
    }
  }
  orders.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return orders;
}