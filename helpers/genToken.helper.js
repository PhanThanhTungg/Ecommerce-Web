const jwt = require('jsonwebtoken');
module.exports.genAccessToken = (id)=>{
  const accessToken = jwt.sign({id: id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE});
  return accessToken;
}
module.exports.genRefreshToken = (id)=>{
  const refreshToken = jwt.sign({id: id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE});
  return refreshToken;
}
