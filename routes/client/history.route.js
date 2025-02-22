const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/history.controller")

router.get('/', controller.index)
router.delete("/delete/:objectId/:id", controller.deleteItem)


module.exports = router