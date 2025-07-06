const router = require("express").Router();
const { getAllItems, addNewItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItems")

router.route("/")
  .get(getAllItems)
  .post(addNewItem)

router.route('/:itemId')
  .delete(deleteItem)


router.route('/:itemId/likes')
  .put(likeItem) // How would this not be a patch? We're not replacing the entire item resource in the database only adding to the likes array
  .delete(unlikeItem)
module.exports = router