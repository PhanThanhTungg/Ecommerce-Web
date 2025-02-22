const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/user.controller")

const validate = require("../../validate/client/user.validate")

const authMiddleware = require("../../middlewares/client/auth.middleware")

//để up file ảnh
const multer  = require('multer')
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

// const storageMulter = require("../../helpers/storageMulter")
const upload = multer() // dest: duong dan luu file upload len

router.get("/register", controller.register)

router.post(
  "/register",
  validate.registerPost,
  controller.registerPost
)

router.get("/login", controller.login)

router.post(
  "/login",
  validate.loginPost,
  controller.loginPost
)

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword)

router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
)

router.get("/password/otp", controller.otpPassword)

router.post("/password/otp", controller.otpPasswordPost)

router.get("/password/reset", controller.resetPassword)

router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
)

router.get(
  "/info",
  authMiddleware.requireAuth,
  controller.info
)

router.patch(
  "/info/edit/:id", 
  upload.single("thumbnail"), 
  uploadCloud.upload,
  controller.editPatch
) // edit sp

module.exports = router;