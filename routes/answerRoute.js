const express = require("express");
const router = express.Router();

//import all the answer controllers
const { addAnswer, answers } = require("../controllers/answerController");

//answer route

router.post("/addanswer", addAnswer);
router.get("/allanswers/:questionid", answers);

//export the route

module.exports = router;
