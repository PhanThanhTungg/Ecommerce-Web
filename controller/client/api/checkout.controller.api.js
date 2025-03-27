const axios = require("axios");
const Order = require("../../../model/order.model");
const moment = require("moment");
module.exports.getDeliveryStatus = async (req,res)=>{
  try {
    const orderId = req.params.orderId;
    const endDate = moment(new Date().setDate(new Date().getDate()+1)).format("yyyy-MM-DD");
    const startDate = moment(new Date().setDate(new Date().getDate()-3)).format("yyyy-MM-DD");
    const api = `https://my.sepay.vn/userapi/transactions/list?transaction_date_min=${startDate}&transaction_date_max=${endDate}`;
    const {data} = await axios.get(api,{
      headers: {
        "Authorization": `Bearer ${process.env.SEPAY_TOKEN_API}`,
        "Content-Type": "application/json"
      }
    })

    const order = await Order.findOne({_id: orderId});
    const filterTransaction = data.transactions.filter(item=>new RegExp(orderId).test(item.transaction_content));
    
    let amountIn = filterTransaction.reduce((val1,val2)=>{
      return val1+parseInt(val2.amount_in);
    },0)
    let amountOut = filterTransaction.reduce((val1,val2)=>{
      return val1+parseInt(val2.amount_out);
    },0)
    const totalAmount = amountIn - amountOut;
    
    let paymentStatus = {
      status: order.paymentStatus.status,
      change: order.paymentStatus.change,
      lack: order.paymentStatus.lack
    };

    if(totalAmount == order.totalPrice && paymentStatus != "ok"){
      await Order.updateOne({_id: orderId},{
        $set:{
          "paymentStatus.status":"ok",
        }
      });
      paymentStatus = {
        status: "ok"
      };
    }
    else if(totalAmount < order.totalPrice && paymentStatus != "lack"){
      await Order.updateOne({_id: orderId},{
        $set:{
          "paymentStatus.status":"lack",
          "paymentStatus.lack":order.totalPrice-totalAmount,
        }
      })
      paymentStatus = {
        status: "lack",
        lack: order.totalPrice-totalAmount
      }
    }
    else if(totalAmount > order.totalPrice && paymentStatus != "change"){
      await Order.updateOne({_id: orderId},{
        $set:{
          "paymentStatus.status":"change",
          "paymentStatus.status":totalAmount - order.totalPrice,
        }
      })
      paymentStatus = {
        status: "change",
        change: totalAmount - order.totalPrice
      };
    }
    res.status(200).json({
      paymentStatus
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
}