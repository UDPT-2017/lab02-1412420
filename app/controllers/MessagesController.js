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

router.post('/get_send_message' , function(req, res, next) {
  var uid = req.body['uid'];
  var anotherUserId = req.body['user_id'];
  req.user.jsonable().getSendMessage(uid, anotherUserId)
    .then(function (message) {
      res.send({ok: true, message: message, error: null});
    })
    .catch(function (error) {
      res.send({ok: false, message: null, error: error});
    });
});

router.post('/get_all_receive_message', function(req, res, next) {
  var jsonable = req.user.jsonable();
  jsonable.getAllReceiveMessages()
  .then(function (messages) {
    res.send({ok: true, messages: messages, error: null});
  })
  .catch(function(error) {
    res.send({ok: false, messages: null, error: error});
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
