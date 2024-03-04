const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ msg: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];
  //   console.log(authHeader);
  //   console.log(token);

  try {
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, userid };
    next();
    // return res.status(200).json({ data });
  } catch (error) {
    return res.status(401).json({ msg: "Authentication failed" });
  }
};

module.exports = authMiddleware;
