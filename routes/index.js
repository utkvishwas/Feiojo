const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");

// Register Routes

router.get("/", function (req, res) {
  var err = "";
  if (req.isAuthenticated()) {
    res.redirect("/posts");
  } else {
    res.render("login", { err: err });
  }
});

router.post("/register", function (req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register", { err: err.message });
      }

      passport.authenticate("local")(req, res, function () {
        res.redirect("/posts");
      });
    }
  );
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/register", function (req, res) {
  var err = "";
  res.render("register", { err: err });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
