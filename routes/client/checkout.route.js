const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/checkout.controller")
const validate = require("../../validate/client/checkout.validate");

router.post("/", controller.index)

router.post("/order", validate.checkout ,controller.order)

router.get("/zalopay/:orderId/:amount", controller.zalopay)

router.post("/zalopay-callback", controller.zalopayCallback)

router.get("/success/:orderId", controller.success)

module.exports = router;