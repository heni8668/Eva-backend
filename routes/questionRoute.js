const express = require("express");
const router = express.Router();

//import all the questions controllers
const {
  askQuestion,
  getAllQuestions,
  getSingleQuestion,
} = require("../controllers/questionController");

//question route
router.post("/askquestion", askQuestion);
router.get("/allquestions", getAllQuestions);
router.get("/singlequestion/:questionid", getSingleQuestion);

//export the route
module.exports = router;
