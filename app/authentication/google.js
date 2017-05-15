var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models').User;

passport.use(new GoogleStrategy({
    clientID: '264486800868-24n9mhd678ghka8qp3cfth26vj7vfmn5.apps.googleusercontent.com',
    clientSecret: 'oRPQuwevjKWReL1t1watZgld',
    callbackURL: "http://localhost:3000/session/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    var email = profile.emails[0].value;
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
