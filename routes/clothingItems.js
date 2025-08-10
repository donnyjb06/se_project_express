const router = require("express").Router();
const {
  getAllItems,
  addNewItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { authenticateUser } = require("../middlewares/auth");

router.route("/").get(getAllItems).post(authenticateUser, addNewItem);


router.use(authenticateUser)
router.route("/:itemId").delete(deleteItem);

router.route("/:itemId/likes").put(likeItem).delete(unlikeItem);
module.exports = router;
