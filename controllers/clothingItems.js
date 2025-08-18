const Item = require("../models/clothingItem");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find({}).populate("owner");
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const addNewItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      next(new BadRequestError("Missing user ID"));
      return;
    }

    const { name, weather, link } = req.body;
    if (!name || !weather || !link) {
      next(new BadRequestError("Missing required field/s"));
      return;
    }

    const item = await Item.create({ name, weather, link, owner: userId });
    await item.populate("owner");
    res.status(201).json(item);
  } catch (error) {
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid value for owner ID"));
      return;
    } else if (error.name === "ValidationError") {
      next(new BadRequestError("Invalid fields: name, weather, or link"));
      return;
    }

    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      next(new BadRequestError("Missing item ID"));
      return;
    }

    const itemToDelete = await Item.findById(itemId).orFail();
    if (itemToDelete.owner.toString() !== req.user._id) {
      next(new BadRequestError("Current user does not own clothing item"));
      return;
    }

    const deletedItem = await Item.findByIdAndDelete(itemId).orFail();
    res
      .status(200)
      .json({ message: "Deleted successfully", item: deletedItem });
  } catch (error) {
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid value for item ID"));
      return;
    } else if (error.name === "DocumentNotFoundError") {
      next(new NotFoundError("Item could not be found"));
      return;
    }

    next(error);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      next(new BadRequestError("Missing user ID"));
      return;
    }

    const { itemId } = req.params;
    if (!itemId) {
      next(new BadRequestError("Missing item ID"));
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail();
    await updatedItem.populate("owner");
    res.status(200).json(updatedItem);
  } catch (error) {
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid value for item ID"));
      return;
    } else if (error.name === "DocumentNotFoundError") {
      next(new NotFoundError("Item could not be found"));
      return;
    }

    next(error);
  }
};

const unlikeItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      next(new BadRequestError("Missing user ID"));
      return;
    }

    const { itemId } = req.params;
    if (!itemId) {
      next(new BadRequestError("Missing item ID"));
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail();
    await updatedItem.populate("owner");
    res.status(200).json(updatedItem);
  } catch (error) {
    if (error.name === "CastError") {
      next(new BadRequestError("Invalid value for item ID"));
      return;
    } else if (error.name === "DocumentNotFoundError") {
      next(new NotFoundError(`Item could not be found`));
      return;
    }

    next(error);
  }
};

module.exports = {
  getAllItems,
  addNewItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
