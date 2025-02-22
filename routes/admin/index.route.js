const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.route")
const productCategoryRoutes = require("./product-category.route")
const roleRoutes = require("./role.route")
const accountRoutes = require("./account.route")
const authRoutes = require("./auth.route")
const myAccountRoutes = require("./my-account.route")
const settingRoutes = require("./setting.route")
const orderRoutes = require("./order.route")
const userRoutes = require("./user.route")

const authMiddleware = require("../../middlewares/admin/auth.middleware")

const systemConfig = require("../../config/system")

module.exports = (app)=>{
    pathAdmin = systemConfig.prefixAdmin
    app.use(
        pathAdmin + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    )
    app.use(pathAdmin + "/products",authMiddleware.requireAuth,productRoutes)
    app.use(pathAdmin + "/products-category", authMiddleware.requireAuth,productCategoryRoutes)
    app.use(pathAdmin + "/roles", authMiddleware.requireAuth,roleRoutes)
    app.use(pathAdmin + "/accounts",authMiddleware.requireAuth,accountRoutes)
    app.use(pathAdmin + "/auth", authRoutes)
    app.use(pathAdmin + "/my-account", authMiddleware.requireAuth, myAccountRoutes)
    app.use(pathAdmin + "/settings", authMiddleware.requireAuth, settingRoutes)
    app.use(pathAdmin + "/orders", authMiddleware.requireAuth, orderRoutes)
    app.use(pathAdmin + "/orders", authMiddleware.requireAuth, orderRoutes)
    app.use(pathAdmin + "/users", authMiddleware.requireAuth, userRoutes)
}