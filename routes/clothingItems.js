const router = require("express").Router();
const {
  getAllItems,
  addNewItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { authenticateUser } = require("../middlewares/auth");
const {
  validateItemId,
  validateItemCreation,
  validateUserId,
} = require("../middlewares/validation");

router
  .route("/")
  .get(getAllItems)
  .post(authenticateUser, validateUserId, validateItemCreation, addNewItem);

router.use(authenticateUser, validateUserId, validateItemId);
router.route("/:itemId").delete(deleteItem);

router.route("/:itemId/likes").put(likeItem).delete(unlikeItem);
module.exports = router;
