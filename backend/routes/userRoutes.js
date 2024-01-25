const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();
const { body, param } = require("express-validator");

router.route("/signup").post(authController.signup);
router.route("/login").post(body("email").isEmail(), authController.login);

router.route("/").get(userController.getAllUsers).post(userController.addUser);

router
  .route("/:userId")
  .get(param("userId").isMongoId(), userController.getUser)
  .patch(param("userId").isMongoId(), userController.updateUser)
  .delete(param("userId").isMongoId(), userController.deleteUser);

module.exports = router;
