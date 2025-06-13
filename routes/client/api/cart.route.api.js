const express = require("express")
const router = express.Router()

const controller = require("../../../controller/client/api/cart.controller.api");

router.post("/getRelatedProductByCategory", controller.getRelatedProductByCategory)

module.exports = router;