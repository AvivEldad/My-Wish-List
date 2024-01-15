const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A category must have a name"],
    unique: true,
    trim: true,
    maxlength: [
      20,
      "A category name must have less or equal then 20 characters",
    ],
    minlength: [3, "A category name must have more or equal then 3 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
