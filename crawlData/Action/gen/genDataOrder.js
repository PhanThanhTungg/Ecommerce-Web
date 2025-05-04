import Order from "../../model/order.model.js";
import OrderProduct from "../../model/order-product.model.js";
import User from "../../model/user.model.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { fetchDistrict, fetchProvince, fetchWard } from "../../helper/fetchLocation.js";

export default async ()=>{
  const listUserId = await User.find({}).select("_id").lean();
  const listProvince = await fetchProvince();
  const orders = [];
  for(let i = 0; i < 10; i++){
    const order = {};
    // orderId
    order.orderId = new mongoose.Types.ObjectId();
    
    // cartId or userId
    const cartoruser = faker.helpers.weightedArrayElement([
      { value: 'cart', weight: 15 },
      { value: 'user', weight: 85 },
    ]);
    if(cartoruser === 'cart'){
      order.cartId = faker.string.uuid();
    }
    else{
      const randomIndex = Math.floor(Math.random() * listUserId.length);
      order.userId = listUserId[randomIndex]._id.toString();
    }

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

    //


    orders.push(order);
  }
  console.log(orders);
}