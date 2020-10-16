

var mid = require("../middleware");
var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' });
});

/* ABOUT about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

/* CONTACT about page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

/* REGISTER GET page. */
router.get('/register', mid.loggedOut, function(req, res, next) {
  res.render('register', { title: 'Contact' });
});

/* REGISTER POST page. */
router.post('/register', function(req, res, next) {
  if (req.body.fullname &&
    req.body.email &&
    req.body.topic &&
    req.body.password &&
    req.body["confirm-password"]) {

      if (req.body.password !== req.body["confirm-password"]) {
        var err = new Error("Passwords do not match.");
        err.status = 400;
        return next(err);
      } 

      var userData = {
        name: req.body.fullname,
        email: req.body.email,
        topic: req.body.topic,
        password: req.body.password
      }

      User.create(userData, function (err, user) {
        if (err) {
          return next(err);
        }
        req.session.userId = user._id;
        res.redirect("/profile");
      });

    } else {
      var err = new Error("All fields are required!");
      err.status = 400;
      next(err);
    }
});


//Log out SETUP
router.get("/logout", function (req, res, next) {
  if (req.session.userId) {
    req.session.destroy(function(error) {
      if (error) {
        return next(error);
      }
      res.redirect("/");
    })
  }
});

//Login SETUP
router.get("/login", mid.loggedOut, function(req, res, next) {
    res.render("login", {title: "Log In"});
});

router.post("/login", function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      }
      req.session.userId = user._id;
      res.redirect("/profile");
    })
  } else {
    var err = new Error("E-mail and password are required.");
    err.status = 401;
    next(err);
  }
});

router.get("/profile", mid.requiresLogIn, function(req, res, next) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      res.render("profile", {title: "Profile", name: user.name, topic: user.topic});
    }
  });
});

module.exports = router;
