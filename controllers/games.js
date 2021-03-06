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

  //   // Delete
  //   app.post("/games/delete/:collectionId/:gameId", (req, res) => {
  //     if (req.user) {
  //         Game
  //           .findByIdAndDelete(req.params.gameid)
  //           .then((game) => {
  //             if (game === null) {
  //               return res.json({ message: "Game does not exist." });
  //             }
  //             return User.deleteOne({ collecions: req.params.id });
  //           })
  //           .then(() =>
  //             res.json({
  //               message: "Collection has been successfully deleted.",
  //               _id: req.params.id,
  //             })
  //           )
  //           .catch((err) => {
  //             console.log(err.message);
  //           });
  //       } else {
  //         return res.status(401); // UNAUTHORIZED
  //       }
  //   });
};
