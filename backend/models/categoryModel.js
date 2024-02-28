const mongoose = require("mongoose");
const User = require("./userModel");

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
});

categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "items",
    select: "-_v",
  });
  next();
});

categorySchema.pre("save", function (next) {
  this.name = this.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  next();
});

categorySchema.pre("save", async function (next) {
  try {
    const user = await User.findById(this.user);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.categories) user.categories = [];
    user.categories.push(this._id);

    await user.save();

    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
