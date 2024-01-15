const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();
const items = require("./itemRoutes");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.addCategory);

router
  .route("/:categoryId")
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.use("/:categoryId/items", items);

module.exports = router;
