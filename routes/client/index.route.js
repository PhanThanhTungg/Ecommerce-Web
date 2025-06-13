
const productRoutes = require("./product.route.js")
const homeRoutes = require('./home.route.js')
const searchRoutes = require('./search.route.js')
const cartRoutes = require('./cart.route.js')
const checkoutRoutes = require('./checkout.route.js')
const userRoutes = require('./user.route.js')
const aboutRoutes = require('./about.route.js')
const historyRoutes = require('./history.route.js')
const discountRoutes = require('./discount.route.js')

const categoryMiddleWare = require("../../middlewares/client/category.middleware.js")
const cartMiddleWare = require("../../middlewares/client/cart.middleware.js")
const userMiddleWare = require("../../middlewares/client/user.middleware.js")
const settingMiddleWare = require("../../middlewares/client/setting.middleware.js")

const session = require("express-session");

module.exports = (app) => {
  app.get('/delete-user-data', async (req, res) => {
    const signedRequest = req.body.signed_request;
    console.log(signedRequest);
      if (!signedRequest) {
          return res.status(400).json({ error: "Missing signed_request" });
      }
  
      // Giải mã signed_request
      const [encodedSignature, payload] = signedRequest.split(".");
      const expectedSignature = crypto
          .createHmac("sha256", process.env.FACEBOOK_APP_SECRET)
          .update(payload)
          .digest("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
  
      if (encodedSignature !== expectedSignature) {
          return res.status(403).json({ error: "Invalid signature" });
      }
  
      const data = JSON.parse(Buffer.from(payload, "base64").toString());
      const userId = data.user_id;
  
      // Xóa dữ liệu của user trong database
      console.log(`Deleting data for user: ${userId}`);
      // Ví dụ: await User.deleteOne({ facebookId: userId });
  
      res.json({
          url: "http://localhost:3000/user/delete-user-data",
          confirmation_code: userId,
      });
  });
  // app.use(userMiddleWare.refreshToken);
  app.use(categoryMiddleWare.category)
  app.use(userMiddleWare.infoUser);
  app.use(cartMiddleWare.cartId);
  app.use(settingMiddleWare.settingsGeneral);

  app.use("/", homeRoutes)
  app.use("/products", productRoutes)
  app.use("/discount", discountRoutes)
  app.use("/search", searchRoutes)
  app.use("/cart", cartRoutes)
  app.use("/checkout", checkoutRoutes)
  app.use("/user", userRoutes)
  app.use("/about", aboutRoutes)
  app.use("/history", historyRoutes)
}
    
