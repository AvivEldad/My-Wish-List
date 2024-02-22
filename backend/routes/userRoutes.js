const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();
const { body, param } = require("express-validator");

router.use(authController.protect);

router.post("/signup", authController.signup);
router.post("/login", body("email").isEmail(), authController.login);

router.post(
  "/forgotPassword",
  body("email").isEmail(),
  authController.forgotPassword
);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMyPassword", authController.updatePassword);

router.get("/getMe", authController.getMe, authController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(authController.restrictTo, userController.addUser);

router.use(authController.restrictTo("admin"));

router
  .route("/:userId")
  .get(
    param("userId").isMongoId(),

    userController.getUser
  )
  .patch(
    param("userId").isMongoId(),

    authController.restrictTo,
    userController.updateUser
  )
  .delete(
    param("userId").isMongoId(),

    authController.restrictTo,
    userController.deleteUser
  );

module.exports = router;
