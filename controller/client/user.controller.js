const md5 = require("md5")
const User = require("../../model/user.model")
const ForgotPassword = require("../../model/forgot-password.model")
const Cart = require("../../model/cart.model")

const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/send-mail")

const Order = require("../../model/order.model")
const Product = require("../../model/product.model")
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  })
}


module.exports.registerPost = async (req, res) => {
  const existUser = await User.findOne({
    email: req.body.email
  })

  if(existUser) {
    req.flash("error", "Email đã tồn tại!")
    res.redirect("back")
    return
  }
  
  req.body.password = md5(req.body.password)
  // const infoUser = {
  //   fullName: req.body.fullName,
  //   email: req.body.email,
  //   password: md5(req.body.password),
  //   tokenUser: generateHelper.generateRandomString(30)
  // }

  const user = new User(req.body)
  await user.save()

  res.cookie("tokenUser", user.tokenUser)

  res.redirect("/")
}

module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  })
}

module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if (!user) {
    req.flash("error", "Email không tồn tại!")
    res.redirect("back")
    return
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu!")
    res.redirect("back")
    return
  }

  if (user.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa!")
    res.redirect("back")
    return
  }

  if (user.deleted == "true") {
    req.flash("error", "Tài khoản hiện đang bị vô hiệu hóa!")
    res.redirect("back")
    return
  }

  res.cookie("tokenUser", user.tokenUser)


  
  const cart = await Cart.findOne({
    user_id: user.id
  })

  if(cart){
    res.cookie("cartId", cart.id)
  }
  else{
    await Cart.updateOne({
      _id: req.cookies.cartId
    }, {
      user_id: user.id
    })  
  }
  

  res.redirect("/")
}

module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser")
  res.clearCookie("cartId")
  res.redirect("/")
}


module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  })
}


module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

	const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if (!user) {
    req.flash("error", "Email không tồn tại!")
    res.redirect("back")
    return
  }

  const otp = generateHelper.generateRandomNumber(8)

  // // 1: Lưu thông tin vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: new Date(Date.now() + 600 * 1000)
  }


  const record = new ForgotPassword(objectForgotPassword)
  await record.save()


  // Gửi mã OTP qua email
  const subject = `Mã OTP lấy lại lại mật khẩu`;
  const content = `Mã OTP của bạn là <b>${otp}</b>. Thời gian hiệu lực là 10 phút, vui lòng không chia sẻ với bất cứ ai.`
  sendMailHelper.sendMail(email, subject, content)

  res.redirect(`/user/password/otp?email=${email}`)
}

module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp

  const find = {
    email: email,
    otp: otp
  }

  const result = await ForgotPassword.findOne(find)

  if(!result) {
    req.flash("error", "OTP không hợp lệ!")
    res.redirect("back")
    return
  }

  const user = await User.findOne({
    email: email
  })

  res.cookie("tokenUser", user.tokenUser)

  res.redirect(`/user/password/reset`)
}

module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  })
}

module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  try {
    await User.updateOne({
      tokenUser: tokenUser
    }, {
      password: md5(password)
    })

    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
}


module.exports.info = async (req, res) => {
  const tokenUser = req.cookies.tokenUser
  //update rank of user
  let totalValue = 0
  let cntFail = 0
  let cntSuccess = 0
  const orders= await Order.find({tokenUser: tokenUser})
  for (const order of orders){
    for (const product of order.products){
      const productItem = await Product.findOne({
        _id: product.product_id, 
        status: "active",
        deleted: false,
      })

      const sizeInfo = productItem.listSize.find(i=>{
        return i.id == product.size_id
      })

      let priceNew = (sizeInfo.price * (100 - productItem.discountPercentage)/100).toFixed(0)
      if(product.status == "biBom") cntFail+=product.quantity
      if(product.status == "daThanhToan"){
        cntSuccess += product.quantity
        totalValue += priceNew*product.quantity
      } 
    }
  }
  const rank = totalValue >= 100000000?"Chiến tướng":(
    totalValue >=50000000? "Cao thủ":(
      totalValue >=10000000?"Kim cương":( 
        totalValue >=5000000?"Vàng":(
          totalValue >=1000000?"Bạc":(
            totalValue >=500000?"Đồng": "Vô hạng"
          )
        )
      )
    )
  )
  await User.updateOne({tokenUser: tokenUser},{rank:rank})
  const infoUser = await User.findOne({
    tokenUser: tokenUser
  }).select("-password")

  infoUser.totalValue = totalValue
  infoUser.cntFail = cntFail
  infoUser.cntSuccess = cntSuccess

  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
    infoUser: infoUser 
  })
}

module.exports.editPatch = async(req, res) =>{

    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}` // cap nhat anh o local
    // }
    // //req.file tra ve object file anh 
    try {
        await User.updateOne({
            _id: req.params.id,
            deleted: false
        }, {
          thumbnail: req.body.thumbnail,
          phone: req.body.phone,
          sex: req.body.sex
        });
        req.flash('success', 'Cập nhật thành công!')
    } catch (error) {
        req.flash('error', 'Cập nhật Thất bại!')
    }

    res.redirect(`back`) //chuyen huong den url
}