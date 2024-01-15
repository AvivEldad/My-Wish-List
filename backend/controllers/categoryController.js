const Category = require("../models/categoryModel");

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
    console.log(sortedCategories);

    res.status(200).json({
      status: "success",
      results: sortedCategories.length,
      data: { sortedCategories },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getCategory = async (req, res) => {
  //
  //
  //
  //get category and all the items
  //
  //
  //   try {
  //     const item = await Item.findById(req.params.itemId);
  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         item,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: "fail",
  //       message: err,
  //     });
  //   }
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
      message: err,
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
      message: err,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  //
  //
  //need to move all the items to general category
  //
  //
  //   try {
  //     await Item.findByIdAndDelete(req.params.itemId);
  //     res.status(204).json({
  //       status: "success",
  //       data: null,
  //     });
  //   } catch (err) {
  //     res.status(404).json({
  //       status: "fail",
  //       message: err,
  //     });
  //   }
};
