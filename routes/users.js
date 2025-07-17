const router = require("express").Router();
const { getAllUsers, getCurrentUser, addNewUser, loginUser } = require("../controllers/users");

router.route("/signin")
  .post(loginUser)

router.route("/signup")
  .post(addNewUser)

router.route("/users/me")
  .get(getUser)

module.exports = router