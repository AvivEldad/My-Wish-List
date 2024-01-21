const Item = require("../models/itemModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
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
      message: err.message,
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
      message: err.message,
    });
  }
};

exports.addItem = async (req, res) => {
  try {
    const name = req.body.name;
    const [avg, pic] = await apiFeatures.getItemInfo(name);
    req.body.image = pic;
    req.body.approximatedPrice = avg;
    const categoryId = new mongoose.Types.ObjectId(req.params.categoryId);
    req.body.category = categoryId;

    const newItem = await Item.create(req.body);
    await Category.findByIdAndUpdate(categoryId, {
      $push: { items: newItem._id },
    });
    res.status(201).json({
      status: "success",
      data: {
        item: newItem,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { rank: newRank, category: newCategoryId, ...updateData } = req.body;

    const currentItem = await Item.findById(itemId);
    if (!currentItem) {
      return res.status(404).json({
        status: "fail",
        message: "Item not found",
      });
    }

    const currentRank = currentItem.rank;
    const currentCategoryId = currentItem.category;

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

    if (newCategoryId !== undefined && newCategoryId !== currentCategoryId) {
      await Category.findByIdAndUpdate(currentCategoryId, {
        $pull: { items: itemId },
      });

      const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        {
          ...updateData,
          rank: newRank !== undefined ? newRank : currentRank,
          category: newCategoryId,
        },
        { new: true, runValidators: true }
      );

      await Category.findByIdAndUpdate(newCategoryId, {
        $addToSet: { items: itemId },
      });

      res.status(200).json({
        status: "success",
        data: {
          updatedItem,
        },
      });
    } else {
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
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
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
      message: err.message,
    });
  }
};
