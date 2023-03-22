
const User = require("../models/userModel");
const mongoose = require("mongoose");

const getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const getUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }

  res.status(200).json(user);
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await User.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!user) {
    return res.status(400).json({ error: "No user found" });
  }

  res.status(200).json(user);
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    return res.status(400).json({ error: "No user found" });
  }

  res.status(200).json(user);
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
