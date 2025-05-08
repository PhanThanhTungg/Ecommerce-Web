const express = require("express");
const router = express.Router();

const controller = require("../../../controller/client/api/dashboard.controller.api.js");

router.post("/olap/fact_sale", controller.olapFactSale);
router.post("/olap/fact_feedback", controller.olapFactFeedback);

module.exports = router;