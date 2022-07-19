const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");

// Delete Routes

router.get("/delete/:id", checkPostOwnershipdelete, function (req, res) {
  var id = req.params.id;
  Post.deleteOne({ _id: id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/posts");
    }
  });
});

function checkPostOwnershipdelete(req, res, next) {
  if (req.isAuthenticated()) {
    Post.findOne({ _id: req.params.id }, function (err, foundPost) {
      if (req.user._id.equals(foundPost.author.id)) {
        next();
      } else {
        // res.redirect("/post/" + req.params.postid);
        res.send("You don't have permission to do that");
      }
    });
  }
}
module.exports = router;
