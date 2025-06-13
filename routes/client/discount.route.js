const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/discount.controller.js")

router.get("/:type", controller.index)

router.post("/getDiscount", controller.getDiscount)

module.exports = router;