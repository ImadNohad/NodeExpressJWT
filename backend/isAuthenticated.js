const jwt = require("jsonwebtoken");
const dbConnection = require("./dbConnection");

require("dotenv").config();

let db = dbConnection();
let dbUsers = db.collection("users");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json("Please login to access the data");
    }

    const verify = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

    req.user = dbUsers.findOne({ _id: verify.id });

    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = isAuthenticated;
