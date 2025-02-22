const express = require("express")
const router = express.Router()

const controller = require("../../controller/admin/order.controller")

router.get("/", controller.index)

router.patch("/change-status-order/:orderId/:productId/:value", controller.changeStatus)


module.exports = router