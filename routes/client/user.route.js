const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/user.controller")

const validate = require("../../validate/client/user.validate")

const authMiddleware = require("../../middlewares/client/auth.middleware")

//để up file ảnh
const multer = require('multer')
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

const passport = require("../../config/passport");
const session = require("express-session");
router.use(passport.initialize());
router.use(
  session({ secret: "secret", resave: false, saveUninitialized: true })
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
router.use(passport.session());

router.post(
  "/login-google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
)

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  controller.googleCallback
);

router.post(
  "/login-facebook",
  (req, res) => {
    req.flash("error", "This website is not registered as a business, please try with google or github");
    return res.redirect("back");
  },
  passport.authenticate("facebook", { scope: ["email"] })
)

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "user/login", session: false }),
  controller.facebookCallback
)

router.post("/login-github", passport.authenticate("github", { scope: ['user:email'] }));
router.get(
  "/github/callback",
  passport.authenticate('github', { failureRedirect: 'user/login' }),
  controller.githubCallback
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