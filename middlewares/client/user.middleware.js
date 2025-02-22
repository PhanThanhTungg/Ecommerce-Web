// lay ra thong tin ca nhan

const User = require("../../model/user.model");

module.exports.infoUser = async (req, res, next) => {
  if(req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active"
    }).select("-password");

    if(user) {
      res.locals.user = user;
      const fullname = user.fullName
      const a = fullname.split(" ")
      res.locals.name = a[a.length-1].toUpperCase()

    }
  }
  
  next();
}