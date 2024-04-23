const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
var cors = require('cors')

const dbConnection = require("./dbConnection");
const isAuthenticated = require("./isAuthenticated");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())
require("dotenv").config();

let db = dbConnection();

let dbUsers = db.collection("users");
let dbProducts = db.collection("products");

app.listen(82);

app.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  dbUsers
    .insertOne({
      username: req.body.username,
      email: req.body.email,
      password: hashed,
    })
    .then((user) => {
      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          { userId: user._id },
          process.env.RANDOM_TOKEN_SECRET,
          { expiresIn: "24h" }
        ),
      });
    })
    .catch((error) => res.status(500).json(error));
});

app.post("/login", (req, res) => {
  dbUsers
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(401).json({ error: "Utilisateur non trouvé !" });

      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid)
            return res.status(401).json({ error: "Mot de passe incorrect !" });

          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.RANDOM_TOKEN_SECRET,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
});

app.get("/products", isAuthenticated, (req, res) => {
  dbProducts
    .find()
    .toArray()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((error) => res.status(500).json(error));
});
