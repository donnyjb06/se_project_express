const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  weather: {
    type: String,
    enum: ["hot", "cold", "warm"],
    required: true,
  },
  imageUrl: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
