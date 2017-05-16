function configRouting(app) {
  var passport = require('passport');
  var session = require('express-session');
  var controllers = require('../app/controllers');
  var auth = require('../app/authentication/authenticate');
  var flash = require('connect-flash');
  var gravatar = require('gravatar');
  // init passport to apply middleware
  // required for passport session
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use('/session', controllers.session);
  app.use('/user', auth("/session/login"), getAvatar,controllers.user);
  app.use('/messages', auth("/session/login"), getAvatar, controllers.messages);
  app.use('/', auth("/session/login"), getAvatar, controllers.index);

  function getAvatar(req, res, next) {
    req.user.avatar = gravatar.url(req.user.email);
    next();
  }
}

module.exports = configRouting;
