const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();
const { body, param } = require("express-validator");
const items = require("./itemRoutes");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    body("name").notEmpty().isAlphanumeric("en-US", { ignore: " -." }),
    categoryController.addCategory
  );

router
  .route("/:categoryId")
  .get(
    param("categoryId").isMongoId(),
    body("name").notEmpty().isAlphanumeric("en-US", { ignore: " -." }),

    categoryController.getCategory
  )
  .patch(
    param("categoryId").isMongoId(),

    categoryController.updateCategory
  )
  .delete(
    param("categoryId").isMongoId(),

    categoryController.deleteCategory
  );

router.use("/:categoryId/items", items);

module.exports = router;
