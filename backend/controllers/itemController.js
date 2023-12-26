const Item = require("../models/itemModel");

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();

    res.status(200).json({
      status: "success",
      results: items.length,
      data: { items },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getItem = async (req, res) => {
  try {
    const id = req.params.itemId * 1;

    const item = await Item.findOne({ id: `${id}` });
    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.addItem = async (req, res) => {
  try {
    //TODO - need to add here a search for the item image
    const newItem = await Item.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        item: newItem,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.itemId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
