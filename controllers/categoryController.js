const Category = require("../models/categoryModel");
const Item = require("../models/itemModel");
const { validationResult } = require("express-validator");
const factory = require("./handlerFactory");
const catchAsync = require("./../Utils/catchAsync");

function categoryComparison(a, b) {
  if (a.name === "General") {
    return -1;
  } else if (b.name === "General") {
    return 1;
  }
  return a.name.localeCompare(b.name);
}

exports.getAllCategories = factory.getAll(
  Category,
  { createdAt: -1 },
  categoryComparison
);

exports.getCategory = factory.getOne(Category);
exports.addCategory = factory.createOne(Category);

exports.updateCategory = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    throw new Error("There is no such category");
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  await Item.deleteMany({ category: req.params.categoryId });
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  if (!category) {
    throw new Error("There is no such category");
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
