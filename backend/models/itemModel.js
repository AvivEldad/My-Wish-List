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
});

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

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
