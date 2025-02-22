const express = require("express")
const router = express.Router()

//để up file ảnh
const multer  = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// const storageMulter = require("../../helpers/storageMulter")
const upload = multer() // dest: duong dan luu file upload len


const validate = require("../../validate/admin/account.validate")

const controller = require("../../controller/admin/account.controller")

router.get("/", controller.index)

router.get("/create", controller.create)

router.post(
    "/create", 
    upload.single("avatar"), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)

router.get("/edit/:id", controller.edit)

router.patch(
    "/edit/:id", 
    upload.single("avatar"), 
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch
)
router.patch("/change-status/:status/:id", controller.changeStatus)


router.delete("/delete/:id", controller.deleteItem)


module.exports = router