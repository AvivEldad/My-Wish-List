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

router.use(authController.protect);

router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMyPassword", authController.updatePassword);

router.get("/getMe", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(authController.restrictTo, userController.addUser);

router.use(authController.restrictTo("admin"));

router
  .route("/:id")
  .get(
    param("id").isMongoId(),

    userController.getUser
  )
  .patch(
    param("id").isMongoId(),

    authController.restrictTo,
    userController.updateUser
  )
  .delete(
    param("id").isMongoId(),

    authController.restrictTo,
    userController.deleteUser
  );

module.exports = router;
