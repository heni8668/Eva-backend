const express = require("express");
const { register, login, check } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

//register user
router.post("/register", register);

//login user
router.post("/login", login);
//check user
router.get("/check", authMiddleware, check);

module.exports = router;
