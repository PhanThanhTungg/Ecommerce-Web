const express = require("express")
const router = express.Router()

const controller = require("../../controller/client/home.controller")

router.get('/', controller.index)

router.get('/contact', controller.contact)

router.post('/contact', controller.contactPost)

module.exports = router