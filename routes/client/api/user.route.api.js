const express = require("express")
const router = express.Router()

const controller = require("../../../controller/client/api/user.controller.api");

router.post("/refresh", controller.refresh);

router.post("/addInformation", controller.addInformation)

module.exports = router;