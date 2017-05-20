var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models').User;
require('dotenv').config();
passport.use(new GoogleStrategy({
    clientID: process.env.GG_CLIENTID,
    clientSecret: process.env.GG_CLIENTSECRET,
    callbackURL: process.env.GG_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    var email = profile.emails[0].value;
    console.log("EMAIL FROM GOOGLE AUTH: " + email);
    User.findOne({ where: { email: email }})
    .then(function(user){
      if(user) {
        user.googleId = profile.id;
        user.save()
        .then(function(anotherUser){
          cb(null, anotherUser);
        });
      } else {
        User.create({
          name: profile.displayName,
          email: email,
          password: profile.id,
          googleId: profile.id
        })
        .then(function(anotherUser){
          cb(null, anotherUser);
        });
      }
    })
    .catch(function(error){
      console.log(error, null);
    });
  }
));



require('./init')(passport);

module.exports = passport;
