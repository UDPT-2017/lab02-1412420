var User = require('../models').User;


module.exports = function(passport) {

	// Serialize sessions
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findOne({ where: { id: id }}).then(function(user){
	    done(null, user);
	  }, function(err){
	    done(err, null);
	  });
	});
};
