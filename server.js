const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");

//middlewares
const app = express();
app.use(express.json());
app.use(cors());

//database connection
const connection = require("./db/dbConfig");
const port = 8000;

//user routes middle ware
app.use("/api/users", userRoutes);

//question routes middlewaree
app.use("/api/questions", questionRoute);

//answer routes middlewaree
app.use("/api/answers", answerRoute);

//check the database is connected
async function conn() {
  try {
    await connection.execute("select 'mysql connected' ");
    // console.log(result);
    await app.listen(port);
    console.log("mysql connected");
    console.log(`server running on port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
conn();

// app.listen(port, (err) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(`server running on port ${port}`);
//   }
// });
