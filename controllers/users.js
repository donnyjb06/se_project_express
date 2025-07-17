const User = require("../models/user");
const { sendErrorCode, STATUS_CODES } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../utils/config")

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    sendErrorCode(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required parameter: userId" });
      return;
    }
    const user = await User.findById(userId).orFail();
    res.status(200).json({ user });
  } catch (error) {
    sendErrorCode(res, error);
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
    res
      .status(201)
      .json({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user.id,
      });
  } catch (error) {
    sendErrorCode(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(STATUS_CODES.UNAUTHORIZED)
      .json({message: "Missing email or password"})
    }

    const user = await User.findUsersByCredentials(email, password)

    const token = jwt.sign({_id: user.id}, JWT_SECRET, {expiresIn: '7d'})
    res.status(200).json({message: "User logged in", token, user: {_id: user.id}})
  } catch (error) {
    sendErrorCode(res, error)
  }
}

module.exports = {
  getAllUsers,
  getUser,
  addNewUser,
};
