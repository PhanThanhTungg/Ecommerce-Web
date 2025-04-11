const express = require("express")
const router = express.Router()

const controller = require("../../../controller/client/api/product.controller.api");

router.get("/:slugCategory?", controller.productApiGetData)

router.get("/type/:type", controller.productApiGettype)

router.post("/detail/feedback", controller.productApiAddFeedback)

module.exports = router;