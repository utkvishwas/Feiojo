const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const commentSchema = new mongoose.Schema({
  comment: String,
  author: {
    id: String,
    username: String,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
