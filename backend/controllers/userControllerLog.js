const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const validatePassword = async (plainPw, hashPw) => {
  return await bcrypt.compare(plainPw, hashPw);
};

const createAccessToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    //1. VALIDATE INPUT FIELDS
    if (!email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email not valid");
    }
    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password not strong enough')
    //   }

    //2. CHECK DB FOR THE SAME EMAIL
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw Error("Email already in use");
    }

    // 3. CREATING USER
    const hashedPw = await hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPw,
      role: role || "student",
    });
    newUser.accessToken = createAccessToken(newUser._id);

    res.status(200).json({ data: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. VERIFY EMAIL & PW
    if (!email || !password) {
      throw Error("All fields must be filled");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Incorrect email");
    }
    const validPw = await validatePassword(password, user.password);
    if (!validPw) {
      throw Error("Incorrect password");
    }
    // 2. CREATE AND REPLACE NEW TOKEN
    const newAccessToken = createAccessToken(user._id);
    await User.findByIdAndUpdate(user._id, { newAccessToken });
    res.status(200).json({ email, role: user.role, newAccessToken });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login };
