const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendErrorCode, STATUS_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required parameter: userId" });
      return;
    }
    const user = await User.findById(_id).orFail();
    res.status(200).json({ user });
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const addNewUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!name || !avatar) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required field/s" });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });
    res.status(201).json({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      _id: user.id,
    });
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing email or password" });
      return;
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res
      .status(200)
      .json({token});
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id || !req.body) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing user ID or missing document fields" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      strict: true,
      runValidators: true,
      new: true
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

module.exports = {
  getCurrentUser,
  addNewUser,
  updateUser,
  loginUser,
};
