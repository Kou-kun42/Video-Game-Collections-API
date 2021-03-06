const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  name: { type: String, required: true },
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Collection", PostSchema);
