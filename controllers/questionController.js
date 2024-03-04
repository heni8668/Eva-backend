const dbConnection = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");

//ask question
const askQuestion = async (req, res) => {
  req.body.questionid = uuidv4();
  res;
  const { questionid, userid, title, description, tag } = req.body;

  //check if title and description are not empty
  if (!title || !description) {
    return res.status(400).json({ msg: "please fill all requied fields" });
  }

  try {
    await dbConnection.query(
      "INSERT INTO questions(questionid,userid,title,description, tag) VALUES (?,?,?,?,?)",
      [questionid, userid, title, description, tag]
    );
    return res.status(201).json({ msg: "question asked successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ msg: "something went wron, please try again later" });
  }
};

//get all the questions
const getAllQuestions = async (req, res) => {
  try {
    const [questionid] = await dbConnection.query(
      "SELECT questions.*, users.username FROM questions JOIN users ON questions.userid = users.userid ORDER BY id DESC"
    );
    return res.status(200).json(questionid);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ msg: "something went wrong, please try again" });
  }
};

//get single question controller
const getSingleQuestion = async (req, res) => {
  // const { id } = req.body;

  // try {
  //   const [userid] = await dbConnection.query(
  //     "SELECT * FROM questions WHERE id = ? ",
  //     [id]
  //   );
  //   return res.json({ SingleQuestion: userid });
  // } catch (error) {
  //   console.log(error.message);
  //   return res
  //     .status(500)
  //     .json({ msg: "Something went wrong, please try again" });
  // }
  const questionid = req.params.questionid;

  try {
    const query = "SELECT * FROM questions WHERE questionid = ?";
    const [question] = await dbConnection.query(query, [questionid]);

    if (question.length === 1) {
      res.status(200).json(question[0]);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { askQuestion, getAllQuestions, getSingleQuestion };
