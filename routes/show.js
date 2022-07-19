const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");

router.get("/posts", isLoggedIn, function (req, res) {
  Post.find(function (err, allPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", { post: allPost });
    }
  });
});

router.get("/post/:postid", isLoggedIn, function (req, res) {
  var post = req.params.postid;
  Post.findOne({ _id: post })
    .populate("comments")
    .exec(function (err, thatpost) {
      if (err) {
        console.log(err);
      } else {
        res.render("singlepost", { thatpost: thatpost });
      }
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
