var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/' , function(req, res, next) {
  res.render(path.join('user', 'index'), {
    title: 'Profile',
    currentUser: req.user
  });
});


module.exports = router;
