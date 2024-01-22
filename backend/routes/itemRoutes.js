const express = require("express");
const itemController = require("../controllers/itemController");
const router = express.Router({ mergeParams: true });
const { body, param } = require("express-validator");

router
  .route("/")
  .get(itemController.getAllItems)
  .post(
    body("name").notEmpty().isAlphanumeric("en-US", { ignore: " -." }),
    body("budget").isNumeric(),
    body("itemLink").isURL(),
    body("description").isAlphanumeric("en-US", { ignore: " -.,:'" }),
    itemController.addItem
  );

router
  .route("/:itemId")
  .get(param("itemId").isMongoId(), itemController.getItem)
  .patch(
    param("itemId").isMongoId(),
    body("name").isAlphanumeric("en-US", { ignore: " -." }),
    body("budget").isNumeric(),
    body("itemLink").isURL(),
    body("description").isAlphanumeric("en-US", { ignore: " -.,:'" }),
    itemController.updateItem
  )
  .delete(param("itemId").isMongoId(), itemController.deleteItem);

module.exports = router;
