const express = require("express");
const router = express.Router();

const {userRegister,userLogin,getUser}= require("../controller/userController");
const {Authentication,Authorization } = require("../middleware/auth")

router.post("/register",userRegister);
router.post("/login",userLogin);
router.get("/user/:userId",Authentication,Authorization,getUser)







module.exports = router;