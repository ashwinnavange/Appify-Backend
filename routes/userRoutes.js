const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controller/userController");
const { isAuthenticated } = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/newUser", registerUser);

router.post("/login", loginUser);

router.get('/user/:_id',isAuthenticated,getUser)

module.exports = router;