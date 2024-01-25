const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address format",
    },
  },
  photo: String,
  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: [8, "A password must be at least 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "The passwords are not the same",
    },
  },

  passwordChangedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this, (confirmPassword = undefined);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
