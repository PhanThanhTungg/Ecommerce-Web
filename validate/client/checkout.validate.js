module.exports.checkout = (req,res,next)=>{
  const arrCheck = ["orderProducts","fullName", "phone", "province", "district", "commune", "detail", "paymentMethod"];
  const validPayment = ["vnpay", "momo", "zalopay", "cash"];
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