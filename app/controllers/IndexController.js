var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/' , function(req, res, next) {
  res.render(path.join('index', 'index'), {
    title: 'Express'
  });
});

router.get('/login' , function(req, res, next) {
  res.render(path.join('index', 'login'), {
    title: 'Express'
  });
});

router.get('/profile' , function(req, res, next) {
  res.render(path.join('index', 'profile'), {
    title: 'Express'
  });
});

module.exports = router;
