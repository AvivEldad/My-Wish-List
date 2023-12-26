const express = require("express");
const itemController = require("../controllers/itemController");
const router = express.Router();

router.route("/").get(itemController.getAllItems).post(itemController.addItem);

router
  .route("/:itemId")
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
