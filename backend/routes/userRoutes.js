const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();
const { body, param } = require("express-validator");

router.route("/signup").post(authController.signup);
router.route("/login").post(body("email").isEmail(), authController.login);

router
  .route("/forgotPassword")
  .post(body("email").isEmail(), authController.forgotPassword);
router
  .route("/resetPassword")
  .post(body("email").isEmail(), authController.resetPassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrictTo,
    userController.addUser
  );

router
  .route("/:userId")
  .get(param("userId").isMongoId(), userController.getUser)
  .patch(
    param("userId").isMongoId(),
    authController.protect,
    authController.restrictTo,
    userController.updateUser
  )
  .delete(
    param("userId").isMongoId(),
    authController.protect,
    authController.restrictTo,
    userController.deleteUser
  );

module.exports = router;
