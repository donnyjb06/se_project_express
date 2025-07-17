const router = require("express").Router();
const { getCurrentUser, addNewUser, loginUser } = require("../controllers/users");
const { authenticateUser } = require("../middlewares/auth")

router.route("/signin")
  .post(loginUser)

router.route("/signup")
  .post(addNewUser)

router.route("/me")
  .get(authenticateUser, getUser)

module.exports = router