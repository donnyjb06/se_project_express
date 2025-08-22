const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { ConflictError } = require("../utils/errors/ConflictError");

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      next(new BadRequestError("Missing user ID"));
      return;
    }
    const user = await User.findById(_id).orFail();
    res.status(200).json({
      name: user.name,
      email: user.email,
      _id: user.id,
      avatar: user.avatar,
    });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      next(new NotFoundError(`User could not be found`));
      return;
    }
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid value for user ID"));
      return;
    }

    next(error);
  }
};

const addNewUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;
    if (!name || !avatar) {
      next(new BadRequestError("Missing required field/s"));
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
    if (error.name === "ValidationError") {
      next(new BadRequestError("Invalid field/s: name, avatar, or email"));
      return;
    }
    if (error.name === "MongoServerError") {
      next(new ConflictError("Duplicate email"));
      return;
    }

    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError("Missing user ID"));
      return;
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      next(new UnauthorizedError(error.message));
      return;
    }

    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id || !req.body) {
      next(new BadRequestError("Missing user ID"));
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      strict: true,
      runValidators: true,
      new: true,
    }).orFail();
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid value for user ID"));
      return;
    }
    if (error.name === "DocumentNotFoundError") {
      next(new NotFoundError("User could not be found"));
      return;
    }

    next(error);
  }
};

module.exports = {
  getCurrentUser,
  addNewUser,
  updateUser,
  loginUser,
};