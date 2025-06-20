const express = require("express")
const router = express.Router()

const controller = require("../../controller/admin/user.controller")

router.get("/", controller.index)

router.patch("/change-status/:status/:id", controller.changeStatus)


router.delete("/delete/:id", controller.deleteItem)


module.exports = router