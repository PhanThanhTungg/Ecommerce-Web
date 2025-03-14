const productApiRoute = require("./product.route.api");

// const categoryMiddleWare = require("../../middlewares/client/category.middleware.js")
const cartMiddleWare = require("../../../middlewares/client/cart.middleware.js")
const userMiddleWare = require("../../../middlewares/client/user.middleware.js")
// const settingMiddleWare = require("../../../middlewares/client/setting.middleware.js")
const systemConfig = require("../../../config/system");
const system = require("../../../config/system");
module.exports =(app)=>{
    // app.use(categoryMiddleWare.category)
    app.use(cartMiddleWare.cartId)
    app.use(userMiddleWare.infoUser)
    // app.use(settingMiddleWare.settingsGeneral)
    app.use(`${system.prefixApi}/products`,productApiRoute);
}

