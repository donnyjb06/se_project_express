const {loginUser, addNewUser} = require("../controllers/users")
const router = require("express").Router();

router.post("/signin", loginUser)
router.post("/signup", addNewUser)

module.exports = router