const express = require("express");
const router = express.Router();

const controller = require("../../../controller/client/api/checkout.controller.api");

router.get("/delivery-status/qr/:orderId", controller.getDeliveryStatus);

module.exports = router;