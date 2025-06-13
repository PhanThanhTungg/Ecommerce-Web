const express = require("express")
const router = express.Router()

const controller = require("../../controller/admin/discount.controller.js")

router.get("/", controller.index)

router.post("/create", controller.create)

router.patch("/edit", controller.edit)

router.delete("/delete/:discountId", controller.delete)


module.exports = router