/* Mongoose Connection */
const mongoose = require("mongoose");
assert = require("assert");

const mongoUri = process.env.MONGODB_URI || "collections-api";
mongoose.Promise = global.Promise;
mongoose.connect(
  mongoUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to database");

    // db.close(); turn on for testing
  }
);
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection Error:")
);
mongoose.set("debug", true);

module.exports = mongoose.connection;
