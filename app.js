const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const Comment = require("./models/comment");
const Post = require("./models/post");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const indexRoutes = require("./routes/index");
const addRoutes = require("./routes/add");
const showRoutes = require("./routes/show");
const updateRoutes = require("./routes/update");
const deleteRoutes = require("./routes/delete");

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(
  require("express-session")({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(showRoutes);
app.use(addRoutes);
app.use(updateRoutes);
app.use(deleteRoutes);

app.listen(process.env.PORT || 80);
