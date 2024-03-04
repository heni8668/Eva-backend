const dbConnection = require("../db/dbConfig");

// add answers to the database
const addAnswer = async (req, res) => {
  const { questionid, userid, answer } = req.body;

  try {
    await dbConnection.query(
      `INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?) `,
      [questionid, userid, answer]
    );

    return res.status(201).json({ msg: "answer added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again" });
  }
};

//get answers from the database

// const getAnswers = async (req, res) => {
//   try {
//     const [answers] = await dbConnection.query(
//       " SELECT answers.answer, answers.userid, users.username, questions.questionid FROM answers JOIN users ON answers.userid = users.userid JOIN questions ON answers.questionid = questions.questionid"
//     );

//     // console.log(answers);
//     if (answers.length > 0) {
//       return res.status(200).json(answers);
//     } else {
//       return res.status(404).json({ msg: "no answers found" });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ msg: "something went wrong, please try again" });
//   }
// };

async function answers(req, res) {
  try {
    const { questionid } = req.params;

    const [answers] = await dbConnection.query(
      `SELECT answers.answer, users.username FROM answers INNER JOIN users ON answers.userid = users.userid
            WHERE answers.questionid = ?`,
      [questionid]
    );

    // Send the retrieved answers as a JSON response
    res.status(200).json({ answers });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Something went wrong while fetching answers" });
  }
}

// module.exports = { getAnswersByQuestionId };

module.exports = { addAnswer, answers };
