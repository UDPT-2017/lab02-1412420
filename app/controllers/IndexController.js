var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/' , function(req, res, next) {
  req.user.getAllUser(function(users){
    res.render(path.join('index', 'index'), {
      title: 'Express',
      currentUser: req.user,
      notice: req.flash('notice')[0],
      users: users
    });
  });
});

module.exports = router;
