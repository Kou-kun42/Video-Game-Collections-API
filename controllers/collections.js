const { Collection } = require("mongoose");
const Post = require("../models/collection");
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
        .then((collection) => {
          return User.findById(req.user._id);
        })
        .then((user) => {
          user.collections.unshift(collection);
          user.save();
          // REDIRECT TO THE NEW POST
          res.redirect(`/collections/${collection._id}`);
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
    var currentUser = req.user;
    console.log(req.cookies);
    Collection.find({})
      .lean()
      .populate("author")
      .then((collections) => {
        res.render("collections-index", { collections, currentUser });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // Read
  app.get("/collections/:id", function (req, res) {
    var currentUser = req.user;
    Post.findById(req.params.id)
      .populate("games")
      .lean()
      .then((collection) => {
        res.render("collection-show", { collection, currentUser });
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
