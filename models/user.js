const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: "You must enter a valid URL",
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "You must enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    statics: {
      async findUserByCredentials(email, password) {
        const user = await this.findOne({ email })
          .select("+password")
          .orFail(() => {
            const error = new Error("Invalid email address");
            error.name = "UnauthorizedError";
            throw error;
          });

        const isMatched = await bcrypt.compare(password, user.password);
        if (isMatched) return user;

        const error = new Error("Invalid password");
        error.name = "UnauthorizedError";
        throw error;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
