var express = require('express');
var router = express.Router();
var path = require('path');
var passportLocal = require('../authentication/local');
var passportGoogle = require('../authentication/google');
var models = require('../models');

router.get('/login' , function(req, res, next) {
  res.render(path.join('user', 'login'), {
    title: 'Login',
    alert: req.flash('alert')[0],
    notice: req.flash('notice')[0]
  });
});

router.get('/logout' , function(req, res, next) {
  req.logout();
  res.redirect('/session/login');
});

router.post('/signup', function(req, res, next){
  models.User.create({
      name: req.body['name'],
      email: req.body['email'],
      password: req.body['password']
    })
    .then(function(user){
      req.flash('notice', 'Create user successfully');
      res.redirect('/session/login');
    })
    .catch(function(error) {
      req.flash('alert', 'Create user failed');
      res.redirect('/session/login');
    });
});

router.post('/create' , function(req, res, next) {
  // function
  passportLocal.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('alert', 'Login failed');
      return res.redirect('/session/login');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.flash('notice', 'Login success');
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/auth/google/callback', function(req, res, next) {
  // function
  passportGoogle.authenticate('google', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('alert', 'Login failed');
      return res.redirect('/session/login');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.flash('notice', 'Login success');
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/auth/google', passportGoogle.authenticate('google', { scope: ['profile', 'email'] }));

module.exports = router;
