var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models').User;
// Use local strategy to create user account
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ where: { email: username }}).then(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (!user.authenticate(password)) {
        done(null, false, { message: 'Invalid password'});
      } else {
        done(null, user);
      }
    }, function(err){
      done(err);
    });
  }
));

require('./init')(passport);

module.exports = passport;
