const Collection = require("../models/collection");
const Game = require("../models/game");
const User = require("../models/user");

module.exports = (app) => {
  // Create new collection
  app.post("/collections/new", (req, res) => {
    if (req.user) {
      var collection = new Collection(req.body);
      collection.games = [];
      collection.author = req.user._id;

      collection
        .save()
        .then(() => {
          return User.findById(req.user._id);
        })
        .then((user) => {
          user.collections.unshift(collection);
          return user.save();
        })
        .then(() => {
          return res.send(collection);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // INDEX
  app.get("/", (req, res) => {
    if (req.user) {
      Collection.find({ author: req.user })
        .then((collections) => {
          res.json({ collections });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      res.json({
        message: "Please sign up or log in to view your collections.",
      });
    }
  });

  // Read
  app.get("/collections/:id", function (req, res) {
    var currentUser = req.user;
    Collection.findByOne({ _id: req.params.id })
      .then((collection) => {
        res.send(collection);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // Update
  app.put("/collections/:id", (req, res) => {
    if (req.user) {
      Collection.findByIdAndUpdate(req.params.id, {
        $set: { name: req.body.name },
      })
        .then(() => {
          return Collection.findOne({ _id: req.params.id });
        })
        .then((collection) => {
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
      Collection.findByIdAndDelete(req.params.id)
        .then((collection) => {
          if (collection === null) {
            return res.json({ message: "Collection does not exist." });
          }
          return User.deleteOne({ collecions: req.params.id });
        })
        .then(() =>
          res.json({
            message: "Collection has been successfully deleted.",
            _id: req.params.id,
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // Add game to collection
  app.post("/collections/:collectionId/add/", (req, res) => {
    if (req.user) {
      Collection.findById(req.params.collectionId)
        .then((collection) => {
          if (collection === null) {
            return res.json({ message: "Collection does not exist." });
          } else {
            Game.findById(req.body.gameId)
              .then((game) => {
                if (game === null) {
                  return res.json({ message: "Game does not exist." });
                } else {
                  return collection.games.unshift(game);
                }
              })
              .then(() => {
                return res.send(collection);
              });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  // Remove game from collection
  app.post("/collections/:collectionId/remove/", (req, res) => {
    if (req.user) {
      Collection.findById(req.params.collectionId)
        .then((collection) => {
          if (collection === null) {
            return res.json({ message: "Collection does not exist." });
          } else {
            Game.findById(req.body.gameId)
              .then((game) => {
                if (game === null) {
                  return res.json({ message: "Game does not exist." });
                } else {
                  return Collection.deleteOne({ games: game });
                }
              })
              .then(() => {
                return res.send(collection);
              });
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
