const express = require("express")
//để up file ảnh
const multer  = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const router = express.Router()

const upload = multer() // dest: duong dan luu file upload len

const controller = require("../../controller/admin/product-category.controller")

const validate = require("../../validate/admin/product-category.validate")

router.get("/", controller.index)

router.get("/create", controller.create)

router.delete("/delete/:id", controller.deleteItem)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti) 

router.post(
    "/create",
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
) // post danh muc

router.get("/edit/:id", controller.edit) // giao dien

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
) // edit danh muc




module.exports = router