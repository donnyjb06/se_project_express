const router = require("express").Router();
const {loginUser, addNewUser} = require("../controllers/users")
const {validateUserCreation, validateUserLogin} = require("../middlewares/validation")

router.post("/signin", validateUserLogin, loginUser)
router.post("/signup", validateUserCreation, addNewUser)

module.exports = router