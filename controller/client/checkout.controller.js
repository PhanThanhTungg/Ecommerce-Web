const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const Order = require("../../model/order.model");
const Discount = require("../../model/discount.model");
const DiscountUser = require("../../model/discount-user.model");
const OrderProduct = require("../../model/order-product.model");
const axios = require("axios");
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const moment = require("moment");
const momoConfig = require("../../config/momo.config")

module.exports.index = async (req, res) => {
  const orderProducts = [];
  if (!req.body.data) {
    req.flash("error", "Vui lòng chọn mặt hàng");
    return res.redirect("back");
  }
  const dataSplit = req.body.data.split(",");
  let totalPrice = 0;
  for (const item of dataSplit) {
    let [productId, sizeId, quantity] = item.split("-");
    quantity = +quantity;

    const product = await Product.findOne({
      _id: productId
    }).select("images title slug listSize discountPercentage")

    const size = product.listSize.find(i => i.id == sizeId)

    size.priceNew = (size.price * (100 - product.discountPercentage) / 100).toFixed(0)

    const totalPriceItem = quantity * size.priceNew

    totalPrice += totalPriceItem

    orderProducts.push({
      product,
      size,
      quantity,
      totalPriceItem
    })
  };
  let discountCoupon = [];
  let discountShipping = [];
  if(res.locals.user){
    const discountUsers = await DiscountUser.find({userId: res.locals.user._id, deleted: false});
    for (const item of discountUsers) {
      const discountItem = await Discount.findOne({
        _id: item.discountId,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        isActive: true,
        deleted: false
      })
      if (discountItem) {
        if (discountItem.type == "coupon") {
          discountCoupon.push(discountItem);
        }
        else if (discountItem.type == "shipping") {
          discountShipping.push(discountItem);
        }
      }
    }
  }

  res.render("client/pages/checkout/index", {
    page: "checkout",
    pageTitle: "Đặt hàng",
    orderProducts,
    totalPrice,
    discountCoupon,
    discountShipping,
  });
};

module.exports.order = async (req, res) => {
  try {
    let { orderProducts, fullName, phone, province, district,
      commune, detail, locationX, locationY, deliveryMethod, paymentMethod, shippingFee, note } = req.body;

    orderProducts = JSON.parse(orderProducts);

    let totalProductPrice = orderProducts.reduce((val1, val2) => {
      return val1 + val2.totalPriceItem;
    }, 0)

    const orderData = {
      userInfo: {
        fullName,
        phone,
        province,
        district,
        commune,
        detail,
        mapId: `${locationX},${locationY}`
      },
      shippingFee,
      totalProductPrice,
      note,
      deliveryMethod,
      deliveryStatus: paymentMethod == "cash" ? "pending" : "pending-payment",
      paymentMethod,
    }
    if (paymentMethod != "cash") {
      orderData.paymentStatus = {
        status: "lack",
        lack: +totalProductPrice + +shippingFee
      }
    }

    if(res.locals.user){
      orderData.userId = res.locals.user?.id;
    }
    else{
      orderData.cartId = req.cookies?.cartId;
    }

    const order = new Order(orderData);
    await order.save();

    for (const item of orderProducts) {
      const orderProduct = new OrderProduct({
        order_id: order.id,
        product_id: item.product._id,
        size_id: item.size._id,
        product_title: item.product.title,
        size: item.size.size,
        price: item.size.price,
        discountPercentage: item.product.discountPercentage,
        quantity: item.quantity,
      })
      await orderProduct.save();
    }

    if (paymentMethod == "zalopay") {
      return res.redirect(`/checkout/zalopay/${order.id}/${+totalProductPrice + +shippingFee}`)
    }
    else if (paymentMethod == "momo") {
      return res.redirect(`/checkout/momo/${order.id}/${+totalProductPrice + +shippingFee}`)
    }

    res.redirect("/checkout/success/" + order.id)
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra trong quá trình đặt hàng, vui lòng thử lại sau");
    return res.redirect("/")
  }
}

module.exports.zalopay = async (req, res) => {
  try {
    const embed_data = {
      redirecturl: process.env.SUB_URLDEPLOY + `/checkout/success/${req.params.orderId}`
    };

    const transID = req.params.orderId;

    const items = [];
    const amount = req.params.amount;
    const description = `Thanh toán đơn hàng #${transID}`;

    const data = {
      app_id: process.env.APP_ID,
      app_trans_id: `${moment().format('YYMMDDhhmmss')}_${transID}`,
      app_user: process.env.USER_ZALOPAY,
      app_time: Date.now(),
      amount: amount,
      embed_data: JSON.stringify(embed_data),
      item: JSON.stringify(items),
      description: description,
      bank_code: "",
      callback_url: process.env.URLDEPLOY + "/checkout/zalopay-callback"
    };

    const dataStr = `${process.env.APP_ID}|${data.app_trans_id}|${data.app_user}|${data.amount}|${data.app_time}|${data.embed_data}|${data.item}`;
    data.mac = CryptoJS.HmacSHA256(dataStr, process.env.KEY1).toString();

    const response = await axios.post(process.env.ZALOPAY_ENDPOINT, null, { params: data });

    if (response.data.order_url) {
      res.redirect(response.data.order_url);
    } else {
      res.send("Không lấy được order_url từ ZaloPay. Kiểm tra lại cấu hình.");
    }
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).send("Có lỗi xảy ra");
  }
}

module.exports.momo = async (req, res) => {
  try {
    const { orderId, amount } = req.params;

    let {
      accessKey,
      secretKey,
      orderInfo,
      partnerCode,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      orderGroupId,
      autoCapture,
      lang,
    } = momoConfig;

    redirectUrl += `/checkout/success/${orderId}`;

    const requestId = `${moment().format('YYMMDDhhmmss')}_${orderId}`;

    const rawSignature = 'accessKey=' + accessKey + '&amount=' + amount + '&extraData=' + extraData + '&ipnUrl=' +
      ipnUrl + '&orderId=' + requestId + '&orderInfo=' + orderInfo + '&partnerCode=' + partnerCode + '&redirectUrl=' +
      redirectUrl + '&requestId=' + requestId + '&requestType=' + requestType;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: requestId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const result = await axios(options);
    res.redirect(result.data.payUrl);
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).send("Có lỗi xảy ra");
  }
}

module.exports.momoCallback = async (req, res) => {
  try {
    if (req.body.message == "Thành công.") {
      const orderId = req.body.requestId.split("_")[1];
      await Order.updateOne({
        _id: orderId,
      }, {
        "paymentStatus.status": "ok",
        "deliveryStatus": "pending",
        $unset: { "paymentStatus.lack": "" }
      })
      res.json({ return_code: 1, return_message: "Success" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Có lỗi xảy ra o callback");
  }
}

module.exports.zalopayCallback = async (req, res) => {
  try {
    const orderId = JSON.parse(req.body.data).app_trans_id.split("_")[1];
    await Order.updateOne({
      _id: orderId,
    }, {
      "paymentStatus.status": "ok",
      "deliveryStatus": "pending",
      $unset: { "paymentStatus.lack": "" }
    })
    res.json({ return_code: 1, return_message: "Success" });
  } catch (error) {
    console.error("Lỗi callback:", error);
    res.status(500).send("Có lỗi xảy ra");
  }
}

module.exports.success = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId
    })

    if (!order) {
      req.flash("Vui lòng tuân thủ theo các bước mua sắm");
      return res.redirect("/")
    }
    let totalPrice = 0

    const products = await OrderProduct.find({
      order_id: order.id
    })

    for (const product of products) {
      const infoProduct = await Product.findOne({
        _id: product.product_id
      })

      const sizeInfo = infoProduct.listSize.find(i => {
        return i.id == product.size_id
      })

      product.thumbnail = infoProduct.images[0];

      product.totalPrice = +(product.price * (1 - product.discountPercentage / 100)).toFixed(0) * product.quantity
      const currentStock = sizeInfo.stock - product.quantity
      await Product.updateOne({ _id: product.product_id }, {
        sales: infoProduct.sales + product.quantity
      })

      await Product.updateOne({
        _id: product.product_id,
        "listSize._id": sizeInfo._id
      }, {
        $set: {
          "listSize.$.stock": currentStock
        }
      })

      totalPrice += product.totalPrice
    }

    res.render("client/pages/checkout/success", {
      pageTitle: "Đặt hàng thành công",
      order: order,
      products,
      totalPrice,
      bankId: process.env.QR_BANK_ID,
      bankAccount: process.env.QR_BANK_ACC
    })
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại sau");
    return res.redirect("/")
  }
}