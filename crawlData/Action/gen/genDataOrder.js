import Product from "../../model/product.model.js";
import User from "../../model/user.model.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { fetchDistrict, fetchProvince, fetchWard } from "../../helper/fetchLocation.js";

export default async (yearMonth) => {
  const listUserId = await User.find({}).select("_id createdAt").lean();

  const listProduct = await Product.find({}).select("_id title listSize._id listSize.size listSize.price discountPercentage").lean()

  const listProvince = await fetchProvince();
  const orders = [];
  const irandom = Math.floor(Math.random() * (130 - 100 + 1)) + 100;
  for (let i = 0; i < irandom; i++) {
    try {
      const order = {};
      // orderId
      order._id = new mongoose.Types.ObjectId();

      // createdAt
      const [year, month] = yearMonth.split('-');
      const from = `${year}-${month}-01`;
      const to = new Date(year, month, 0); // ngày cuối cùng của tháng
      const toStr = `${year}-${month}-${to.getDate()}`;
      order.createdAt = faker.date.between({ from, to: toStr });


      // cartId or userId
      const filterListUserId = listUserId.filter(item => {
        const createdAt = new Date(item.createdAt);
        const orderCreatedAt = new Date(order.createdAt);
        return createdAt.getTime() <= orderCreatedAt.getTime();
      });
      const randomIndex = Math.floor(Math.random() * filterListUserId.length);
      order.userId = filterListUserId[randomIndex]._id.toString();


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
      const maxNum = Math.floor(Math.random() * 10) + 68;
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 5) + 1;
      const num3 = 100 - maxNum - num1 - num2;

      const orderProducts = [];
      const quantity = faker.helpers.weightedArrayElement([
        { value: 1, weight: maxNum },
        { value: 2, weight: num1 },
        { value: 3, weight: num2 },
        { value: 4, weight: num3 },
      ]);
      for (let j = 0; j < quantity; j++) {
        const indexProduct = Math.floor(Math.random() * listProduct.length);
        const indexSize = Math.floor(Math.random() * listProduct[indexProduct].listSize.length);
        const value1Quantity = Math.floor(Math.random() * 20) + 70;
        orderProducts.push({
          order_id: order._id.toString(),
          product_id: listProduct[indexProduct]._id.toString(),
          size_id: listProduct[indexProduct].listSize[indexSize]._id.toString(),
          product_title: listProduct[indexProduct].title,
          size: listProduct[indexProduct].listSize[indexSize].size,
          price: listProduct[indexProduct].listSize[indexSize].price,
          discountPercentage: listProduct[indexProduct].discountPercentage,
          quantity: faker.helpers.weightedArrayElement([
            { value: 1, weight: value1Quantity },
            { value: 2, weight: 100 - value1Quantity },
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
      const instantWeight = Math.floor(Math.random() * 20 + 50);
      const deliveryMethod = faker.helpers.weightedArrayElement([
        { value: 'instant', weight: instantWeight },
        { value: 'standard', weight: 100 - instantWeight },
      ]);
      order.deliveryMethod = deliveryMethod;

      // deliveryStatus
      const deliveredWeight = Math.floor(Math.random() * 20 + 60);
      const pendingPaymentWeight = Math.floor(Math.random() * 5 + 10);
      const deliveryStatus = faker.helpers.weightedArrayElement([
        { value: 'pending-payment', weight: pendingPaymentWeight },
        { value: 'delivered', weight: deliveredWeight },
        { value: 'cancelled', weight: 100 - deliveredWeight - pendingPaymentWeight }
      ]);
      order.deliveryStatus = deliveryStatus;

      // paymentStatus
      if (deliveryStatus === 'delivered') order.paymentStatus = { status: "ok" };
      else if (deliveryStatus === 'pending-payment') order.paymentStatus = { status: "lack", lack: totalProductPrice + shippingFee };

      // paymentMethod
      const cashWeight = Math.floor(Math.random() * 20 + 50);
      const momoWeight = Math.floor(Math.random() * 10) + 1;
      const zalopayWeight = Math.floor(Math.random() * 10) + 1;
      const qrWeight = 100 - cashWeight - momoWeight - zalopayWeight;
      const paymentMethod = faker.helpers.weightedArrayElement([
        { value: 'momo', weight: momoWeight },
        { value: 'zalopay', weight: zalopayWeight },
        { value: 'cash', weight: cashWeight },
        { value: 'qr', weight: qrWeight },
      ]);
      order.paymentMethod = paymentMethod;

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