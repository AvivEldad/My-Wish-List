const Item = require("../models/itemModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const APIFeatures = require("../Utils/APIFeatures");
const factory = require("./handlerFactory");
const catchAsync = require("./../Utils/catchAsync");
const multer = require("multer");
const AppError = require("../Utils/appError");
const sharp = require("sharp");

const apiFeatures = new APIFeatures();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.minetype.startWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadItemPhoto = upload.single("photo");

exports.resizeItemPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  req.file.fileName = `item-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/items/${req.file.fileName}`);
  next();
};

exports.getAllItems = factory.getAll(Item, { rank: 1, createdAt: -1 }, null);

exports.getItem = factory.getOne(Item);

exports.addItem = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.body.user) req.body.user = req.user.id;
  const name = req.body.name;
  const [avg, pic] = await apiFeatures.getItemInfo(name);
  req.body.image = req.file ? req.file.fileName : pic;
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
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const itemId = req.params.itemId;
  const { rank: newRank, category: newCategoryId, ...updateData } = req.body;

  const currentItem = await Item.findById(itemId);
  if (!currentItem) {
    throw new Error("There is no such item");
  }

  const currentRank = currentItem.rank;
  const currentCategoryId = currentItem.category;

  if (req.file) req.body.image = req.file.fileName;

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
});

exports.deleteItem = factory.deleteOne(Item);
