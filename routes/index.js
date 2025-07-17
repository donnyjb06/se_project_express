const router = require("express").Router();
const {loginUser, addNewUser} = require("../controllers/users")

router.post("/signin", loginUser)
router.post("/signup", addNewUser)

module.exports = router