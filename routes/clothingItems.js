const router = require("express").Router();
const { getAllItems, addNewItem, deleteItem } = require("../controllers/clothingItems")

router.route("/")
  .get(getAllItems)
  .post(addNewItem)

router.route('/:itemId')
  .delete(deleteItem)

module.exports = router