const User = require("../../model/user.model");
const bcrypt = require("bcrypt");
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

  // Check password strength
  const password = req.body.password;
  
  if (password.length < 8) {
    req.flash("error", `Password must be at least 8 characters long!`);
    res.redirect("back");
    return;
  }

  if (!/(?=.*[a-z])/.test(password)) {
    req.flash("error", `Password must contain at least 1 lowercase letter!`);
    res.redirect("back");
    return;
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    req.flash("error", `Password must contain at least 1 uppercase letter!`);
    res.redirect("back");
    return;
  }

  if (!/(?=.*\d)/.test(password)) {
    req.flash("error", `Password must contain at least 1 number!`);
    res.redirect("back");
    return;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    req.flash("error", `Password must contain at least 1 special character (@$!%*?&)!`);
    res.redirect("back");
    return;
  }

  if (req.body.password != req.body.checkPassword) {
    req.flash("error", `Passwords do not match!`);
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

module.exports.loginPost = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if (!req.body.email) {
    req.flash("error", `Please enter email field !`)
    res.redirect("back")
    return
  }

  if (!req.body.password) {
    req.flash("error", `Please enter password field !`)
    res.redirect("back")
    return
  }

  if (!user) {
    req.flash("error", "Email doesn't exist !")
    res.redirect("back")
    return
  }

  const checkPW = await bcrypt.compare(password, user.password);
  if (!checkPW) {
    req.flash("error", "Wrong password !")
    res.redirect("back")
    return
  }

  if (user.status !== "active") {
    req.flash("error", "Your acccount is imactive!")
    res.redirect("back")
    return
  }

  if (user.deleted == "true") {
    req.flash("error", "Your account is being locked!")
    res.redirect("back")
    return
  }

  next();
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

