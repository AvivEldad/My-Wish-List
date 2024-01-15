const Item = require("../models/itemModel");
const APIFeatures = require("../Utils/APIFeatures");

const apiFeatures = new APIFeatures();

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ rank: 1, createdAt: -1 });

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
    const item = await Item.findById(req.params.itemId);
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
    const name = req.body.name;
    const [avg, pic] = await apiFeatures.getItemInfo(name);
    req.body.image = pic;
    req.body.approximatedPrice = avg;
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
    const itemId = req.params.itemId;
    const { rank: newRank, ...updateData } = req.body;

    const currentItem = await Item.findById(itemId);
    if (!currentItem) {
      return res.status(404).json({
        status: "fail",
        message: err,
      });
    }
    const currentRank = currentItem.rank;
    if (newRank !== undefined && newRank !== currentRank) {
      const incAmount = newRank < currentRank ? 1 : -1;
      const query = {
        rank: {
          $gte: Math.min(newRank, currentRank),
          $lte: Math.max(newRank, currentRank),
        },
      };

      await Item.updateMany(query, { $inc: { rank: incAmount } });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      newRank !== undefined ? { ...updateData, rank: newRank } : updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        updatedItem,
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
