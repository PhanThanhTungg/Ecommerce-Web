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
  } catch (error) {
    console.log(error);
  }
  next();
}
module.exports.refreshOneTime = async(req,res,next)=>{
  console.log("refresh");
  // if(!req.session.hasRun && req.cookies.refreshToken){
  //   console.log(req.session.hasRun);
  //   req.session.hasRun = true;
  //   try {
  //     const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
  //     const user = await User.findOne({_id: decoded.id});
  //     if(!user) return next();
  //     const accessToken = genTokenHelper.genAccessToken(user.id);
  //     res.cookie("accessToken", accessToken);
  //   } catch (error) {
  //     console.log(error); 
  //   }
  // }
  next();
}