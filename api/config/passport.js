var LocalStrategy = require("passport-local").Strategy;
var User          = require("../models/user");

module.exports = function(passport) {

  passport.use('local-signup', new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  }, function(req, username, password, done) {

    // Find a user with this username
    User.findOne({ 'local.username' : username }, function(err, user) {
      // Error found
      if (err) return done(err, false, { message: "Something went wrong." });

      // No error but already an user registered
      if (user) return done(null, false, { message: "Please choose another username." });

      var newUser            = new User();
      newUser.local.username = username;
      newUser.local.username = req.body.username;
      newUser.local.password = User.encrypt(password);

      newUser.save(function(err, user) {
        // Error found
        console.log(err)
        if (err) return done(err, false, { message: "Something went wrong." });
        
        // New user created
        return done(null, user);
      });
    });
  }));
  
}