const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An item must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "An item name must have less or equal then 15 characters"],
    minlength: [3, "An item name must have more or equal then 3 characters"],
  },
  rating: {
    type: Number,
    default: 3,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  budget: {
    type: Number,
  },
  approximatedPrice: {
    type: Number,
  },
  itemLink: {
    type: mongoose.SchemaTypes.Url,
    trim: true,
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
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
