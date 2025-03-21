const User = require("../../model/user.model")
const ForgotPassword = require("../../model/forgot-password.model")
const Cart = require("../../model/cart.model");

const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/send-mail")

const Order = require("../../model/order.model")
const Product = require("../../model/product.model")

const genTokenHelper = require("../../helpers/genToken.helper");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
  if (res.locals.user) {
    res.redirect("/");
    return;
  }

  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  })
}

module.exports.registerPost = async (req, res) => {
  if (res.locals.user) {
    res.redirect("/");
    return;
  }
  let { fullName, email, password } = req.body;
  password = await bcrypt.hash(password, 12) + "";

  const user = new User({ fullName, email, password });
  const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(user.id), genTokenHelper.genRefreshToken(user.id)];
  await user.save();
  res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  await Cart.create({ user_id: user.id });
  res.redirect("/")
}

module.exports.login = async (req, res) => {
  if (res.locals.user) {
    res.redirect("/");
  }
  else {
    res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập",
    })
  }
}

module.exports.loginPost = async (req, res) => {
  if (res.locals.user) {
    res.redirect("/");
    return;
  }

  const email = req.body.email
  const user = await User.findOne({
    email: email,
    deleted: false,
  })
  const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(user.id), genTokenHelper.genRefreshToken(user.id)];

  res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  const cart = await Cart.findOne({
    user_id: user.id
  })

  if (!cart) {
    await Cart.create({ user_id: user.id });
  }

  res.redirect("/")
}

module.exports.googleCallback = async (req, res) => {
  // console.log(req.user._json);
  // {
  //   sub: '115783213458694311484',
  //   name: 'Giàu Lương',
  //   given_name: 'Giàu',
  //   family_name: 'Lương',
  //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ8SFer5iVIElBQBSv21Iffv7g0SdMahUscmy74RHPT_FdpGQ=s96-c',
  //   email: 'quanggiau3344@gmail.com',
  //   email_verified: true
  // }
  const userData = req.user._json;
  const user = await User.findOne({
    googleId: userData.sub,
  })
  if (user) {
    if (user.status !== "active") {
      req.flash("error", "Your acccount is imactive!")
      return res.redirect("back")
    }

    if (user.deleted == "true") {
      req.flash("error", "Your account is being locked!")
      return res.redirect("back")
    }
    const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(user.id), genTokenHelper.genRefreshToken(user.id)];
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.redirect("/");
  }

  const checkEmailUser = await User.findOne({ email: userData.email });
  if (checkEmailUser) {
    req.flash("error", "Your email existed!")
    return res.redirect("/user/login")
  }

  const newUser = new User({
    email: userData.email,
    fullName: userData.name,
    googleId: userData.sub,
    thumbnail: userData.picture
  })

  await newUser.save();
  const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(newUser.id), genTokenHelper.genRefreshToken(newUser.id)];
  res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.redirect("/");
}

module.exports.facebookCallback = async (req, res) => {
  // console.log(req.user._json);
  // {
  //   id: '1836971063736854',
  //   name: 'Phan Thanh Tùng',
  //   picture: {
  //     data: {
  //       height: 50,
  //       is_silhouette: false,
  //       url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1836971063736854&height=50&width=50&ext=1745080053&hash=Abb_FfyCFPPy9mhHfDMRoSDt',
  //       width: 50
  //     }
  //   },
  //   email: 'quanggiau3344@gmail.com'
  // }

  const userData = req.user._json;
  const user = await User.findOne({
    facebookId: userData.id,
  })
  if (user) {
    if (user.status !== "active") {
      req.flash("error", "Your acccount is imactive!")
      return res.redirect("back")
    }

    if (user.deleted == "true") {
      req.flash("error", "Your account is being locked!")
      return res.redirect("back")
    }
    const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(user.id), genTokenHelper.genRefreshToken(user.id)];
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.redirect("/");
  }

  const checkEmailUser = await User.findOne({ email: userData.email });
  if (checkEmailUser) {
    req.flash("error", "Your email existed!")
    return res.redirect("/user/login")
  }

  const newUser = new User({
    email: userData.email,
    fullName: userData.name,
    facebookId: userData.id,
    thumbnail: userData.picture.data.url
  })

  await newUser.save();
  const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(newUser.id), genTokenHelper.genRefreshToken(newUser.id)];
  res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.redirect("/");
}

module.exports.githubCallback = async (req, res) => {
  // console.log(req.user._json);
  // {
  //   login: 'PhanThanhTungg',
  //   id: 166277205,
  //   node_id: 'U_kgDOCekwVQ',
  //   avatar_url: 'https://avatars.githubusercontent.com/u/166277205?v=4',
  //   gravatar_id: '',
  //   url: 'https://api.github.com/users/PhanThanhTungg',
  //   html_url: 'https://github.com/PhanThanhTungg',
  //   followers_url: 'https://api.github.com/users/PhanThanhTungg/followers',
  //   following_url: 'https://api.github.com/users/PhanThanhTungg/following{/other_user}',
  //   gists_url: 'https://api.github.com/users/PhanThanhTungg/gists{/gist_id}',
  //   starred_url: 'https://api.github.com/users/PhanThanhTungg/starred{/owner}{/repo}',
  //   subscriptions_url: 'https://api.github.com/users/PhanThanhTungg/subscriptions',
  //   organizations_url: 'https://api.github.com/users/PhanThanhTungg/orgs',
  //   repos_url: 'https://api.github.com/users/PhanThanhTungg/repos',
  //   events_url: 'https://api.github.com/users/PhanThanhTungg/events{/privacy}',
  //   received_events_url: 'https://api.github.com/users/PhanThanhTungg/received_events',
  //   type: 'User',
  //   user_view_type: 'public',
  //   site_admin: false,
  //   name: null,
  //   company: null,
  //   blog: '',
  //   location: null,
  //   email: null,
  //   hireable: null,
  //   bio: null,
  //   twitter_username: null,
  //   notification_email: null,
  //   public_repos: 3,
  //   public_gists: 0,
  //   followers: 0,
  //   following: 0,
  //   created_at: '2024-04-07T05:27:44Z',
  //   updated_at: '2025-03-11T04:37:19Z'
  // }
  // console.log(req.user.emails[0].value);
  // phantungpt03@gmail.com
  const [userData, email] = [req.user._json, req.user.emails[0].value];
  
  const user = await User.findOne({
    githubId: userData.id,
  })
  if (user) {
    if (user.status !== "active") {
      req.flash("error", "Your acccount is imactive!")
      return res.redirect("back")
    }

    if (user.deleted == "true") {
      req.flash("error", "Your account is being locked!")
      return res.redirect("back")
    }
    const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(user.id), genTokenHelper.genRefreshToken(user.id)];
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.redirect("/");
  }

  const checkEmailUser = await User.findOne({ email});
  if (checkEmailUser) {
    req.flash("error", "Your email existed!")
    return res.redirect("/user/login")
  }

  const newUser = new User({
    email,
    fullName: userData.login,
    githubId: userData.id,
    thumbnail: userData.avatar_url
  })

  await newUser.save();
  const [accessToken, refreshToken] = [genTokenHelper.genAccessToken(newUser.id), genTokenHelper.genRefreshToken(newUser.id)];
  res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.redirect("/");
}

module.exports.logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
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

  if (!result) {
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
  if (res.locals.user) {
    const tokenUser = res.locals.user.tokenUser;
    //update rank of user
    let totalValue = 0
    let cntFail = 0
    let cntSuccess = 0
    const orders = await Order.find({ tokenUser: tokenUser })
    for (const order of orders) {
      for (const product of order.products) {
        const productItem = await Product.findOne({
          _id: product.product_id,
          status: "active",
          deleted: false,
        })

        const sizeInfo = productItem.listSize.find(i => {
          return i.id == product.size_id
        })

        let priceNew = (sizeInfo.price * (100 - productItem.discountPercentage) / 100).toFixed(0)
        if (product.status == "biBom") cntFail += product.quantity
        if (product.status == "daThanhToan") {
          cntSuccess += product.quantity
          totalValue += priceNew * product.quantity
        }
      }
    }
    const rank = totalValue >= 100000000 ? "Chiến tướng" : (
      totalValue >= 50000000 ? "Cao thủ" : (
        totalValue >= 10000000 ? "Kim cương" : (
          totalValue >= 5000000 ? "Vàng" : (
            totalValue >= 1000000 ? "Bạc" : (
              totalValue >= 500000 ? "Đồng" : "Vô hạng"
            )
          )
        )
      )
    )
    await User.updateOne({ tokenUser: tokenUser }, { rank: rank })
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
}

module.exports.editPatch = async (req, res) => {

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