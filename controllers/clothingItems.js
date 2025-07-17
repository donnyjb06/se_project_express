const { STATUS_CODES, sendErrorCode } = require("../utils/errors");
const Item = require("../models/clothingItem");

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({}).populate("owner").populate("likes");
    res.status(200).json({ items });
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const addNewItem = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing _id property" });
      return;
    }

    const { name, weather, imageUrl } = req.body;
    if (!name || !weather || !imageUrl) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required field/s" });
      return;
    }

    const item = await Item.create({ name, weather, imageUrl, owner: userId });
    await item.populate("owner");
    res.status(201).json(item);
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required parameter: itemId" });
      return;
    }

    const itemToDelete = await Item.findById(itemId).orFail();
    if (!itemToDelete.owner === req.user._id) {
      res.status(STATUS_CODES.FORBIDDEN)
      .json({message: "User does not own clothing item"})
      return
    }

    const deletedItem = await Item.findByIdAndDelete(itemId).orFail();
    res
      .status(200)
      .json({ message: "Deleted successfully", item: deletedItem });
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const likeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing _id property" });
      return;
    }

    const { itemId } = req.params;
    if (!itemId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required parameter: itemId" });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail();
    await (await updatedItem.populate("owner")).populate("likes");
    res.status(200).json(updatedItem);
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

const unlikeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing _id property" });
      return;
    }

    const { itemId } = req.params;
    if (!itemId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Missing required parameter: itemId" });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail();
    await (await updatedItem.populate("owner")).populate("likes");
    res.status(200).json(updatedItem);
  } catch (error) {
    sendErrorCode(req, res, error);
  }
};

module.exports = {
  getAllItems,
  addNewItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
