const express = require("express")
const router = express.Router()

const controller = require("../../../controller/client/api/product.controller.api");

router.get("/:slugCategory?", controller.productApiGetData)

router.get("/type/:type", controller.productApiGettype)

module.exports = router;