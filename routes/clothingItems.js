const router = require("express").Router();
const { getAllItems, addNewItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItems")

router.route("/")
  .get(getAllItems)
  .post(addNewItem)

router.route('/:itemId')
  .delete(deleteItem)

// How would liking an item be a PUT and not a PATCH? We're not replacing the entire "item" resource in the database
// We're only adding a reference to a user document to the likes array.
router.route('/:itemId/likes')
  .put(likeItem)
  .delete(unlikeItem)
module.exports = router