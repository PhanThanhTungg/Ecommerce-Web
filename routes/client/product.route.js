const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/product.controller")

router.get('/', controller.index)

router.get('/:slugCategory', controller.category)

router.get('/detail/:slugProduct', controller.detail)


router.post('/detail/feedback/:slugProduct', controller.feedback)

module.exports = router