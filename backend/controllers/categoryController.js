const Category = require("../models/categoryModel");
const Item = require("../models/itemModel");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    const sortedCategories = categories.sort((a, b) => {
      if (a.name === "General") {
        return -1;
      } else if (b.name === "General") {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    res.status(200).json({
      status: "success",
      results: sortedCategories.length,
      data: { sortedCategories },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    await Item.deleteMany({ category: req.params.categoryId });
    await Category.findByIdAndDelete(req.params.categoryId);
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
