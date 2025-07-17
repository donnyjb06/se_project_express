const router = require("express").Router();
const { getAllItems, addNewItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItems")
const {authenticateUser} = require("../middlewares/auth")

router.route("/")
  .get(getAllItems)
  .post(authenticateUser, addNewItem)

router.route('/:itemId')
  .delete(authenticateUser, deleteItem)

// How would liking an item be a PUT and not a PATCH? We're not replacing the entire "item" resource in the database
// We're only adding a reference to a user document to the likes array.
router.route('/:itemId/likes')
  .put(likeItem)
  .delete(unlikeItem)
module.exports = router