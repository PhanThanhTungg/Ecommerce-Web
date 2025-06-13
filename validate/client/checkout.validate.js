module.exports.checkout = (req,res,next)=>{
  console.log(req.body);
  const arrCheck = ["orderProducts","fullName", "phone", "province", "district", "commune", "detail", "paymentMethod", "shippingFee"];
  const validPayment = ["vnpay", "momo", "zalopay", "cash", "qr"];
  if(!validPayment.includes(req.body.paymentMethod)){
    req.flash("error", `Vui lòng tuân thủ các bước mua sắm`)
    return res.redirect("/");
  }
  for(const item of arrCheck){
    if(!req.body[item]){
      req.flash("error", `Vui lòng tuân thủ các bước mua sắm`)
      return res.redirect("/");
    }
  }

  next();
}