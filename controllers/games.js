const Post = require("../models/collection");
const Game = require("../models/game");
const User = require("../models/user");

module.exports = (app) => {
  // Create new game
  app.post("/games/new", (req, res) => {
    if (req.user) {
      var game = new Game(req.body);

      game
        .save()
        .then(() => {
          return res.send(game);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // Read
  app.get("/games/:id", function (req, res) {
    if (req.user) {
      Game.findById(req.params.id)
        .then((game) => {
          return res.send(game);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // Update
  app.put("/games/:id", (req, res) => {
    if (req.user) {
      Game.findByIdAndUpdate(req.params.id, {
        $set: { title: req.body.name, platform: req.body.platform },
      })
        .then(() => {
          return Game.findOne({ _id: req.params.id });
        })
        .then((game) => {
          return res.json({ game });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });
};
