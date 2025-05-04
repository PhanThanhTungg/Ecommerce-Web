import genDataUser from "./Action/gen/genDataUser.js";
import { readJson, writeJson } from "./Action/fileHandle.js";
import {connect } from "./config/database.js";
import User from "./model/user.model.js";
import genDataOrder from "./Action/gen/genDataOrder.js";

const userAction = async ()=>{
  // const users =  await genDataUser();
  // await writeJson("./DataFakeGen/Customer/T2.json", users);

  const usersRead = await readJson("./DataFakeGen/Customer/T2.json");
  for(const user of usersRead){
    const newUser = new User(user);
    await newUser.save();
  }
}

const orderAction = async ()=>{
  genDataOrder();
}

const main = async()=>{
  await connect();
  // await userAction();
  await orderAction();
}
main();