const { validationResult } = require("express-validator");
const catchAsync = require("./../Utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.itemId || req.params.categoryId;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      throw new Error("There is no such document");
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: newDoc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.itemId || req.params.categoryId;
    const doc = await Model.findById(id);
    if (!doc) {
      throw new Error("There is no such document");
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, firstSort, comparisonFn) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find({ user: req.user.id }).sort(firstSort);

    const doc = await query;
    if (comparisonFn) {
      doc.sort(comparisonFn);
    }

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: { doc },
    });
  });
