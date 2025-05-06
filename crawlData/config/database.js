import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://TungConnectDTB:TungConnectDTB@cluster0.berquuj.mongodb.net/myProject")
    console.log("connect to dtb success!")
  } catch (error) {
    console.log(error);
    console.log("connect to dtb error!")
  }
}


