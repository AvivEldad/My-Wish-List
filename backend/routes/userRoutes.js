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

router.get(
  "/getMe",
  authController.protect,
  authController.getMe,
  authController.getUser
);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

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
