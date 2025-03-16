const User = require("../../model/user.model");
const jwt = require('jsonwebtoken');
module.exports.requireAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if(!accessToken) {
    return res.redirect("/user/login");
  } else {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findOne({_id: decoded.id, status: "active", deleted: false});
      if(!user) return res.redirect("/user/login");
      res.locals.user = user;
      return next();
    } catch (error) {
      console.log(error);
      return res.redirect("/user/login");
    }
  }
}