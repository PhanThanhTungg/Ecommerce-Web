module.exports.getPaymentMethod = (str)=>{
  switch(str){
    case "cash":
      return "Tiền mặt";
      break;
    case "qr":
      return "Mã QR";
      break;
    case "momo":
      return "Ví momo";
      break;
    case "zalopay":
      return "Zalopay";
      break;
    case "vnpay":
      return "Vnpay";
      break;
  }
}