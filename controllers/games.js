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
        .then((user) => {
          // REDIRECT TO THE NEW Game
          res.redirect(`/games/${game._id}`);
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
    Game.findById(req.params.id)
      .lean()
      .then((game) => {
        res.redirect("/");
        return res.json({ game });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // Update
  app.post("/collections/:id", (req, res) => {
    if (req.user) {
      collection
        .findByIdAndUpdate(req.params.id, req.body)
        .then(() => {
          return Collection.findOne({ _id: req.params.id });
        })
        .then((collection) => {
          res.redirect("/");
          return res.json({ collection });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // Delete
  app.post("/collections/delete/:id", (req, res) => {
    if (req.user) {
      collection
        .findByIdAndDelete(req.params.id)
        .then((collection) => {
          if (collection === null) {
            return res.json({ message: "Collection does not exist." });
          } else {
            res.redirect("/");
            return res.json({ message: "Collection deleted successfully." });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });
};
