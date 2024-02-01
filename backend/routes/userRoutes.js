const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();
const { body, param } = require("express-validator");

router.post("/signup", authController.signup);
router.post("/login", body("email").isEmail(), authController.login);

router.post(
  "/forgotPassword",
  body("email").isEmail(),
  authController.forgotPassword
);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

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
