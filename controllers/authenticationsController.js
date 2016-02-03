var passport = require("passport");
var User     = require('../models/user');
var secret   = require('../config/config').secret 
var jwt      = require('jsonwebtoken');
var bcrypt   = require('bcrypt-nodejs');





function register(req, res, next) {

  // calling the local signup strategy which is in config/passport.js
  var signupStrategy = passport.authenticate('local-signup', function(err, user) {

      if (err) { 
        return next(err) 
      }

      // Creating a new token using JWT
      var token = jwt.sign(user, secret);

      // Returning token and user as JSON
      res.json({ user: user, token: token });


    })

  signupStrategy(req, res, next);

};


function login(req, res, next) {

  User.findOne({'local.email': req.body.email}, function(err, user){
    console.log(err)
    if (err) {
      return res.status(401).send("Something went wrong")
    } else if (user == null) {
      return res.status(401).send("User not found!")
    }


    // compare password with bcrypt encrypted password
    if (bcrypt.compareSync(req.body.password, user.local.password)) {

      // If the credentials are valid, create JWT token & return user and token as JSON
      var token = jwt.sign(user, secret, { expiresIn: 60*60*24 });
      res.json({ user: user, token: token });


    } else {

      // if password is not correct, an error message is shown
      res.status(401).send("Incorrect password");
    };

  });
};

module.exports = {
  login: login,
  register: register
}