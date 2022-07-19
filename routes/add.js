const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");

// Add Post

router.get("/addnew", isLoggedIn, function (req, res) {
  res.render("addnew");
});

router.post("/addnew", isLoggedIn, function (req, res) {
  const { title, image, body } = req.body;
  Post.create({
    title: title,
    image: image,
    body: body,
    author: {
      id: req.user._id,
      username: req.user.username,
    },
  });
  res.redirect("/posts");
});

// Add Comment

router.post("/addcomment", isLoggedIn, function (req, res) {
  var comment = req.body.comment;
  var postid = req.body.postid;
  Comment.create(
    {
      comment: comment,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    },
    function (err, commentdata) {
      Post.findOne({ _id: postid }, function (err, post) {
        if (err) {
          console.log(err);
        } else {
          post.comments.push(commentdata._id);
          post.save();
        }
      });
    }
  );
  res.redirect("/post/" + postid);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
