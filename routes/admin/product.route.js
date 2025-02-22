const express = require("express")

//để up file ảnh
const multer  = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// const storageMulter = require("../../helpers/storageMulter")
const upload = multer() // dest: duong dan luu file upload len


const router = express.Router()

const controller = require("../../controller/admin/product.controller")
const validate = require("../../validate/admin/product.validate")

router.get("/", controller.index)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti) 

router.delete("/delete/:id", controller.deleteItem)

router.get("/create", controller.create) // giao diện

router.post(
    "/create",
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
) // post sp

router.get("/edit/:id", controller.edit) // giao dien

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
) // edit sp


router.get("/detail/:id", controller.detail) 
module.exports = router