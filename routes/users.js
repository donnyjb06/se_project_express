const router = require("express").Router();
const { getAllUsers, getUser, addNewUser } = require("../controllers/users");

router.route("/")
  .get(getAllUsers)
  .post(addNewUser)

router.route("/:userId")
  .get(getUser)

module.exports = router