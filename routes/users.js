const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { authenticateUser } = require("../middlewares/auth")

router.route("/me")
  .all(authenticateUser)
  .get(getCurrentUser)
  .patch(updateUser)

module.exports = router