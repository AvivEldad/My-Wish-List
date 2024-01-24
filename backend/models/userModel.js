const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
    trim: true,
    maxlength: [20, "A name must have less or equal then 20 characters"],
    minlength: [3, "A name must have more or equal then 2 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: [8, "A password must be at least 8 characters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm password"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
