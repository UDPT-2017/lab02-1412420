var express = require('express');
var router = express.Router();
var path = require('path');
var models = require('../models');

router.get('/' , function(req, res, next) {
  res.render(path.join('user', 'index'), {
    title: 'Profile',
    currentUser: req.user
  });
});

router.post('/add_friend', function(req, res, next) {
  models.Relationship.create(req.body)
  .then(function (rel) {
    res.send({ok: true, rel: JSON.stringify(rel), error: null});
  })
  .catch(function(error) {
    res.send({ok: false, rel: null, error: error});
  });
});

router.post('/remove_friend', function(req, res, next) {
  models.Relationship.destroy({
    where: {
      userId: req.body.userId,
      friendId: req.body.friendId
    }
  })
  .then(function (rel) {
    res.send({ok: true, rel: JSON.stringify(rel), error: null});
  })
  .catch(function(error) {
    res.send({ok: false, rel: null, error: error});
  });
});

router.post('/get_all_friend', function(req, res, next) {
  req.user.getAllFriend()
  .then(function(users) {
    res.send({ok: true, users: JSON.stringify(users), error: null});
  })
  .catch(function(error) {
    res.send({ok: false, users: null, error: error});
  });
});

module.exports = router;
