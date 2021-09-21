const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        if (value === "test@test.com") {
          throw new Error("Unreal email address. ");
        }
        return true;
      }),
    check("email").custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        return Promise.reject("Invalid email provided");
      }
      return true;
    }),
    body(
      "password",
      "Password should be between 5 to 10 characters and alphabets and numbers."
    )
      .isLength({ min: 5, max: 10 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter vzalid email")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("Unreal email address. ");
      }
      return true;
    }),
  body(
    "password",
    "Password should be between 5 to 10 characters and alphabets and numbers."
  )
    .isLength({ min: 5, max: 10 })
    .isAlphanumeric(),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("confirm password should match password. ");
      }
      return true;
    })
    .withMessage("Password and confirm password must match."),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
