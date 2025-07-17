const router = require("express").Router();
const { getCurrentUser, addNewUser, loginUser, updateUser } = require("../controllers/users");
const { authenticateUser } = require("../middlewares/auth")

router.route("/signin")
  .post(loginUser)

router.route("/signup")
  .post(addNewUser)

router.route("/me")
  .all(authenticateUser)
  .get(getCurrentUser)
  .patch(updateUser)

module.exports = router