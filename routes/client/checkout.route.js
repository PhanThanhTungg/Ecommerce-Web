const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/checkout.controller")

router.post("/", controller.index)

router.post("/order", controller.order)

router.get("/success/:orderId", controller.success)

module.exports = router;