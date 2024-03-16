const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/newUser", registerUser);

router.post("/login", loginUser);

router.get('/user/:_id',getUser)

module.exports = router;