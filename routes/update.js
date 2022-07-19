const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");

// Post Update
router.get("/edit/:postid", checkPostOwnershipedit, function (req, res) {
  var post = req.params.postid;
  Post.findById(post, function (err, thatpost) {
    if (err) {
      console.log(err);
    } else {
      res.render("editpost", { thatpost: thatpost });
    }
  });
});

router.post("/update", checkPostOwnershippost, function (req, res) {
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var id = req.body.id;

  Post.findByIdAndUpdate(
    { _id: id },
    { title: title, image: image, body: body },
    { new: true },
    function (err) {
      console.log(err);
    }
  );
  res.redirect("/post/" + id);
});

// Comment Update
router.get(
  "/comment/:commentid/edit",
  checkCommentOwnership,
  function (req, res) {
    commentid = req.params.commentid;

    Comment.findById(commentid, function (err, commentdata) {
      if (err) {
        console.log(err);
      } else {
        res.render("editcomment", { commentdata: commentdata });
      }
    });
  }
);

router.post(
  "/updatecomment/:commentid",
  checkCommentOwnership,
  function (req, res) {
    commentid = req.params.commentid;
    commentdata = req.body.comment;
    Comment.findByIdAndUpdate(
      { _id: commentid },
      { comment: commentdata },
      { new: true },
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    res.redirect("/posts");
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkPostOwnershipedit(req, res, next) {
  if (req.isAuthenticated()) {
    Post.findOne({ _id: req.params.postid }, function (err, foundPost) {
      if (req.user._id.equals(foundPost.author.id)) {
        next();
      } else {
        // res.redirect("/post/" + req.params.postid);
        res.send("You don't have permission to do that");
      }
    });
  }
}

function checkPostOwnershippost(req, res, next) {
  if (req.isAuthenticated()) {
    Post.findOne({ _id: req.body.id }, function (err, foundPost) {
      if (req.user._id.equals(foundPost.author.id)) {
        next();
      } else {
        // res.redirect("/post/" + req.body.id);
        res.send("You don't have permission to do that");
      }
    });
  }
}

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findOne(
      { _id: req.params.commentid },
      function (err, foundComment) {
        if (req.user._id.equals(foundComment.author.id)) {
          next();
        } else {
          // res.redirect("/post/" + req.params.postid);
          res.send("You don't have permission to do that");
        }
      }
    );
  }
}

module.exports = router;
