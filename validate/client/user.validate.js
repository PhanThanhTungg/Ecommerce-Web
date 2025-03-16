const User = require("../../model/user.model");
module.exports.registerPost = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Please enter name field!`);
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Please enter email field!`);
    res.redirect("back");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Please enter password field!`);
    res.redirect("back");
    return;
  }

  if (req.body.password != req.body.checkPassword) {
    req.flash("error", `Passwords don't match`);
    res.redirect("back");
    return;
  }

  const existUser = await User.findOne({
    email: req.body.email
  })

  if (existUser) {
    req.flash("error", "Email already exists!")
    res.redirect("back")
    return
  }

  next();
}

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Email không được để trống!`)
    res.redirect("back")
    return
  }

  if (!req.body.password) {
    req.flash("error", `Mật khẩu không được để trống!`)
    res.redirect("back")
    return
  }

  next()
}

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Email không được để trống!`)
    res.redirect("back")
    return
  }

  next()
}

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `Mật khẩu không được để trống!`)
    res.redirect("back")
    return
  }

  if (!req.body.confirmPassword) {
    req.flash("error", `Xác nhận mật khẩu không được để trống!`)
    res.redirect("back")
    return
  }

  if (req.body.password !== req.body.confirmPassword) {
    req.flash("error", `Xác nhận mật khẩu sai!`)
    res.redirect("back")
    return
  }

  next()
}

