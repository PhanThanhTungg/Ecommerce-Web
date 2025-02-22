
const productRoutes = require("./product.route.js")
const homeRoutes = require('./home.route.js')
const searchRoutes = require('./search.route.js')
const cartRoutes = require('./cart.route.js')
const checkoutRoutes = require('./checkout.route.js')
const userRoutes = require('./user.route.js')
const aboutRoutes = require('./about.route.js')
const historyRoutes = require('./history.route.js')

const categoryMiddleWare = require("../../middlewares/client/category.middleware.js")
const cartMiddleWare = require("../../middlewares/client/cart.middleware.js")
const userMiddleWare = require("../../middlewares/client/user.middleware.js")
const settingMiddleWare = require("../../middlewares/client/setting.middleware.js")

module.exports =(app)=>{
    app.use(categoryMiddleWare.category)
    app.use(cartMiddleWare.cartId)
    app.use(userMiddleWare.infoUser)
    app.use(settingMiddleWare.settingsGeneral)

    app.use("/",homeRoutes)
    app.use("/products",productRoutes)
    app.use("/search",searchRoutes)
    app.use("/cart",cartRoutes)
    app.use("/checkout",checkoutRoutes)
    app.use("/user",userRoutes)
    app.use("/about",aboutRoutes)
    app.use("/history",historyRoutes)
}

