const User = require("../../model/user.model");
const jwt = require('jsonwebtoken');
module.exports.infoUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findOne({ _id: decoded.id, status: "active", deleted: false });
      if (user) res.locals.user = user;
    }
  } catch (error) {
    console.log(error);
  }
  next();
}