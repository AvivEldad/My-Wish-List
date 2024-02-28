const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An item must have a name"],
    unique: true,
    trim: true,
    maxlength: [30, "An item name must have less or equal then 30 characters"],
    minlength: [3, "An item name must have more or equal then 3 characters"],
  },
  budget: {
    type: Number,
    default: 0,
  },
  approximatedPrice: {
    type: Number,
  },
  itemLink: {
    type: String,
    validator: function (val) {
      return val.match(/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/);
    },
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: [true, "An item must have an image"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  tags: [String],
  status: {
    type: String,
    enum: ["active", "pending", "archived"],
    default: "active",
  },
  rank: {
    type: Number,
    min: 1,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Item must belong to a category."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Item must belong to a user"],
    index: true,
  },
});

itemSchema.index({ rating: 1, createdAt: -1 });

itemSchema.pre("save", async function (next) {
  if (!this.rank) {
    try {
      const listLength = await this.constructor.countDocuments();

      this.rank = listLength + 1;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

itemSchema.pre("save", function (next) {
  this.name = this.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
