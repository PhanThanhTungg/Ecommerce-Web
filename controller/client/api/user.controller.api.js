const jwt = require("jsonwebtoken");
const User = require("../../../model/user.model");
const genTokenHelper = require("../../../helpers/genToken.helper");
module.exports.refresh = async (req,res)=>{
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.status(401).json({mess: "not logged in yet"});
  try {
    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    const checkUser = await User.findOne({_id: decoded.id, status: "active", deleted: false});
    if(!checkUser) return res.status(403).json({mess: "account is not existed"});
    const accessToken = genTokenHelper.genAccessToken(checkUser.id);
    res.cookie("accessToken", accessToken, {httpOnly: true, maxAge: 60*1000});
    return res.status(200).json({mess: "refresh token successfully"});
  } catch (error) {
    return res.status(400).json({mess: error.message});
  }
}