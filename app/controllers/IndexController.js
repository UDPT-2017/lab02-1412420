var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/' , function(req, res, next) {
  console.log('------------------------------');
  console.log(res.locals);
  res.render(path.join('index', 'index'), {
    title: 'Express',
    currentUser: req.user,
    notice: req.flash('notice')[0]
  });
});


module.exports = router;
