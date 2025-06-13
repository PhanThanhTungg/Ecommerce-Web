const User = require("../../model/user.model");
const jwt = require('jsonwebtoken');
const genTokenHelper = require("../../helpers/genToken.helper")

module.exports.infoUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findOne({ _id: decoded.id, status: "active", deleted: false });
      if (user) res.locals.user = user;
    }
    else {
      try {
        const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) return next();
        res.locals.user = user;
        const accessToken = genTokenHelper.genAccessToken(user.id);
        const refreshToken = genTokenHelper.genRefreshToken(user.id);
        res.cookie("accessToken", accessToken, {httpOnly: true, maxAge: 60*1000});
        res.cookie("refreshToken",refreshToken,{httpOnly: true, maxAge: 7*24*60*60*1000})
      } catch (error) {
        
      }
    }
  } catch (error) {
    
    // if (error.name === "TokenExpiredError") {
    //   if (req.cookies.refreshToken) {
    //     try {
    //       const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    //       const user = await User.findOne({ _id: decoded.id });
    //       if (!user) return next();
    //       const accessToken = genTokenHelper.genAccessToken(user.id);
    //       res.locals.user = user;
    //       res.cookie("accessToken", accessToken);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // }
  }
  next();
}
// module.exports.refreshToken = async (req, res, next) => {
//   if (req.cookies.refreshToken) {
//     try {
//       const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
//       const user = await User.findOne({ _id: decoded.id });
//       if (!user) return next();
//       const accessToken = genTokenHelper.genAccessToken(user.id);
//       res.cookie("accessToken", accessToken);
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   next();
// }