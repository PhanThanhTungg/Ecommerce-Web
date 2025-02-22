const ProductCategory = require("../../model/product-category.model")
const Product = require("../../model/product.model")
const AccountAdmin = require("../../model/account.model")
const AccountUser = require("../../model/user.model")

module.exports.dashboard = async (req,res)=>{

    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        }
    }

    statistic.categoryProduct.total = await ProductCategory.countDocuments({deleted: false})

    statistic.categoryProduct.active = await ProductCategory.countDocuments({deleted: false, status: "active"})

    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({deleted: false, status:"inactive"})


    statistic.product.total = await Product.countDocuments({deleted: false})

    statistic.product.active = await Product.countDocuments({deleted: false, status: "active"})

    statistic.product.inactive = await Product.countDocuments({deleted: false, status:"inactive"})


    statistic.account.total = await AccountAdmin.countDocuments({deleted: false})

    statistic.account.active = await AccountAdmin.countDocuments({deleted: false, status: "active"})

    statistic.account.inactive = await AccountAdmin.countDocuments({deleted: false, status:"inactive"})
    

    statistic.user.total = await AccountUser.countDocuments({deleted: false})

    statistic.user.active = await AccountUser.countDocuments({deleted: false, status: "active"})

    statistic.user.inactive = await AccountUser.countDocuments({deleted: false, status:"inactive"})
    res.render("admin/pages/dashboard/index",{
        papeTitle: "Trang tổng quan",
        statistic: statistic
    })
}