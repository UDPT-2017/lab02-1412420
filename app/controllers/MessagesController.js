var express = require('express');
var router = express.Router();
var path = require('path');


router.post('/update_read' , function(req, res, next) {
  var uid = req.body['uid'];
  var anotherUserId = req.body['user_id'];
  req.user.jsonable().updateReadMessage(uid, anotherUserId)
    .then(function (message) {
      res.send({ok: true, message: message, error: null});
    })
    .catch(function (error) {
      res.send({ok: false, message: null, error: error});
    });
});

router.post('/send', function(req, res, next) {
  var users = req.body.users;
  var message = req.body.message;
  console.log(users);
  console.log(message);
  req.user.jsonable().insertArrayMessage(users, message)
    .then(function(result) {
      res.send({ok: true, error: null});
    })
    .catch(function(error) {
      res.send({ok: false, error: error});
    });
});

module.exports = router;
