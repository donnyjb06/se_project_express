const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { authenticateUser } = require("../middlewares/auth");
const { validateUserId, validateUserUpdate } = require("../middlewares/validation");

router
  .route("/me")
  .all(authenticateUser, validateUserId)
  .get(getCurrentUser)
  .patch(validateUserUpdate, updateUser);

module.exports = router;
