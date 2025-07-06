const User = require("../models/user");
const {sendErrorCode, ERROR_CODES} = require("../utils/errors");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    sendErrorCode(req, res, error)
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Missing required parameter: userId" });
      return;
    }
    const user = await User.findById(userId).orFail();
    res.status(200).json({ user });
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const addNewUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      res.status(ERROR_CODES.BAD_REQUEST).json({ message: "Missing required field/s" })
      return
    }

    const user = await User.create({ name, avatar });
    res.status(201).json(user)
  } catch (error) {
    sendErrorCode(req, res, error)
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addNewUser,
};
