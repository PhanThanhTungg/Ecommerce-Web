const ProductCategory = require("../../model/product-category.model")
const Product = require("../../model/product.model")
const AccountAdmin = require("../../model/account.model")
const AccountUser = require("../../model/user.model")

module.exports.dashboard = async (req,res)=>{

    const statistic = {
        Category: {
            active: 0,
            inactive: 0
        },
        Product: {
            active: 0,
            inactive: 0,
        },
        "Admin-Account": {
            active: 0,
            inactive: 0,
        },
        "Customer-Account": {
            active: 0,
            inactive: 0,
        }
    }

    statistic.Category.active = await ProductCategory.countDocuments({deleted: false, status: "active"})

    statistic.Category.inactive = await ProductCategory.countDocuments({deleted: false, status:"inactive"})


    statistic.Product.active = await Product.countDocuments({deleted: false, status: "active"})

    statistic.Product.inactive = await Product.countDocuments({deleted: false, status:"inactive"})


    statistic["Admin-Account"].active = await AccountAdmin.countDocuments({deleted: false, status: "active"})

    statistic["Admin-Account"].inactive = await AccountAdmin.countDocuments({deleted: false, status:"inactive"})
    

    statistic["Customer-Account"].active = await AccountUser.countDocuments({deleted: false, status: "active"})

    statistic["Customer-Account"].inactive = await AccountUser.countDocuments({deleted: false, status:"inactive"})
   
    res.render("admin/pages/dashboard/index",{
        papeTitle: "Trang tổng quan",
        statistic: statistic
    })
}