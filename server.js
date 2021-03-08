require("dotenv/config");

const express = require("express");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

require("./data/collections-db");

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (
    typeof req.cookies.nToken === "undefined" ||
    req.cookies.nToken === null
  ) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// Controllers required here, after all middleware is initialized.
require("./controllers/auth.js")(app);
require("./controllers/collections.js")(app);
require("./controllers/games.js")(app);

app.listen(process.env.PORT, () => {
  console.log(`Collections API listening on port ${process.env.PORT}!`);
});

module.exports = app;
