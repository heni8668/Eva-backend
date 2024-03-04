//import db connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

//register user
const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  //check the user info
  if (!username || !firstname || !lastname || !email || !password) {
    return res.json({ msg: "please provide all user info" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid from users where username = ? or email = ? ",
      [username, email]
    );

    //check if the user is exist
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already registered" });
    }

    //check the password length
    if (password.length < 6) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 character" });
    }

    //password encrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)  ",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(201).json({ msg: "user registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "user is not registered" });
  }
};

//login user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "please fill all requied fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password from users WHERE email = ? ",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ msg: "invalid credential" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "password not match " });
    }

    //decrypt password
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({ msg: "logged in successfully", token, username });
    // return res.json({ user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ msg: "something went wrong, please try again" });
  }
};
const check = async (req, res) => {
  const username = req.user.username;
  const userid = req.user.userid;

  res.status(200).json({ msg: "the user is authenticated", username, userid });
};

module.exports = { register, login, check };
