const { validationResult } = require("express-validator");

exports.deleteOne = (Model) => async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.userId || req.params.itemId || req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      throw new Error("There is no such document");
    }
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

exports.createOne = (Model) => async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOne = (Model) => async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.userId || req.params.itemId || req.params.id;
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAll = (Model, firstSort, secondSort) => async (req, res) => {
  try {
    let query = Model.find().sort(firstSort);
    if (secondSort) query = query.sort(secondSort);
    const doc = await query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: { doc },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
