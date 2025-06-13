const express = require("express")
const router = express.Router()
const multer = require("multer")

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const controller = require("../../controller/admin/setting.controller")

router.get("/general", controller.general)

router.patch(
  "/general",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 }
  ]),
  uploadCloud.uploadMutiple,
  controller.generalPatch
)

module.exports = router