var express = require('express');
var router = express.Router();
var path = require('path');
var models = require('../models');
/* GET home page. */
router.get('/' , function(req, res, next) {

  var users = [];
  var receiveMessage = [];
  var jsonable = req.user.jsonable();
  req.user.getAllUser()
  .then(function(allUsers) {
    users = allUsers;
    return jsonable.getAllReceiveMessages();
  })
  .then(function (rMessages) {
    receiveMessage = rMessages;
    return jsonable.getAllSendMessages();
  })
  .then(function (sendMessages) {
    res.render(path.join('index', 'index'), {
      title: 'Express',
      currentUser: req.user,
      notice: req.flash('notice')[0],
      users: users,
      rMessages: receiveMessage,
      sMessages: sendMessages
    });
  });
});


module.exports = router;
