const axios = require("axios");
const Order = require("../../../model/order.model");
const moment = require("moment");
module.exports.getDeliveryStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const endDate = moment(new Date().setDate(new Date().getDate() + 1)).format("yyyy-MM-DD");
    const startDate = moment(new Date().setDate(new Date().getDate() - 3)).format("yyyy-MM-DD");
    const api = `https://my.sepay.vn/userapi/transactions/list?transaction_date_min=${startDate}&transaction_date_max=${endDate}`;
    const { data } = await axios.get(api, {
      headers: {
        "Authorization": `Bearer ${process.env.SEPAY_TOKEN_API}`,
        "Content-Type": "application/json"
      }
    })

    const order = await Order.findOne({ _id: orderId });
    const totalPrice = order.totalProductPrice + order.shippingFee;

    const filterTransaction = data.transactions.filter(item => new RegExp(orderId).test(item.transaction_content));
   
    const amountIn = filterTransaction.reduce((val1, val2) => {
      return val1 + parseInt(val2.amount_in);
    }, 0)


    let paymentStatusObject = {
      status: order.paymentStatus?.status,
      lack: order.paymentStatus?.lack || 0,
    };

    if (amountIn >= totalPrice && paymentStatusObject.status == "lack") {
      await Order.updateOne({ _id: orderId }, {
        $set: {
          deliveryStatus: "pending",
          "paymentStatus.status": "ok",
        }
      });
      paymentStatusObject = {
        status: "ok"
      };
    }
    else if (amountIn < totalPrice && paymentStatusObject.status == "lack") {
      await Order.updateOne({ _id: orderId }, {
        $set: {
          "paymentStatus.status": "lack",
          "paymentStatus.lack": totalPrice - amountIn,
        }
      })
      paymentStatusObject = {
        status: "lack",
        lack: totalPrice - amountIn
      }
    }

    res.status(200).json({
      paymentStatus: paymentStatusObject,
      amountIn,
      lack: totalPrice - amountIn
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
}