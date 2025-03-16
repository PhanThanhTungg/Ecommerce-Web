const User = require("../../model/user.model");
const jwt = require('jsonwebtoken');
module.exports.requireAuth = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if(!accessToken) {
    res.redirect("/user/login");
    return;
  } else {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (error, decodedToken)=>{
      if(error){
        res.redirect("/user/login");
        return;
      }
      const user = await User.findOne({_id: decodedToken.id, status: "active", deleted: false});
      if(!user){
        res.redirect("/user/login");
        return;
      }
      res.locals.user = user;
    })
  }
  next();
}