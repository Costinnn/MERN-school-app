const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student",
    enum: ["director", "professor", "student"],
  },
  accessToken: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
