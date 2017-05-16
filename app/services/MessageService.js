function MessageService(user) {

  var safeParse = require("safe-json-parse/tuple");
  var models = require('../models');
  // JSON
  // user
  // name
  // message
  // time
  // uid -> time in milisecond
  // read -> 1
  // readtime

  var support = {
    messagesToArray: function(message) {
      var content = safeParse(message.content)[1];
      var length = Object.keys(content).length;
      var result = [];
      for(var i = 0 ; i < length ; i++) {
        result[i] = content[i + 1];
      }
      return result;
    },
    sortMessages: function(messages) {
      function swap(items, firstIndex, secondIndex){
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
      }

      function partition(items, left, right) {

        var pivot   = items[Math.floor((right + left) / 2)].uid;
        var i       = left;
        var j       = right;

        while (i <= j) {

          while (items[i].uid > pivot) {
            i++;
          }

          while (items[j].uid < pivot) {
            j--;
          }

          if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
          }
        }

        return i;
      }

      function quickSort(items, left, right) {

        var index;

        if (items.length > 1) {

          index = partition(items, left, right);

          if (left < index - 1) {
            quickSort(items, left, index - 1);
          }

          if (index < right) {
            quickSort(items, index, right);
          }

        }

        return items;
      }

      // first call
      var t0 = Date.now();
      var resultSort =  quickSort(messages, 0, messages.length - 1);
      var t1 = Date.now();
      console.log("MEASURE TIME SORT: " + (t1 - t0) + " milliseconds.");
      return resultSort;
    }
  }

  var getMessage = function(anotherUser) {
    return models.Message.findOrCreate({
      where: {
        $or: [
          { userId: user.id, friendId: anotherUser.id },
          { userId: anotherUser.id, friendId: user.id },
        ]
      },
      defaults: {
        userId: user.id,
        content: JSON.stringify({}),
        friendId: anotherUser.id
      }
    });
  }

  var insertMessage = function (message, anotherUser, cb) {
    getMessage(anotherUser)
    .spread(function(thisMessage, created) {
      var content = safeParse(thisMessage.content)[1];
      var length = Object.keys(content).length;
      var buildMessage = {
        user: user.id,
        name: user.name,
        message: message,
        uid: Date.now(),
        time: new Date()
      }
      content[length + 1] = buildMessage;
      thisMessage.content = JSON.stringify(content);
      return thisMessage.save();
    })
    .then(function(m) {
      return cb(m, null);
    })
    .catch(function(error) {
      return cb(null, error);
    });
  }

  var getAllMessages = function(cb) {
    models.Message.findAll({
      where: {
        $or: [
          { userId: user.id },
          { friendId: user.id },
        ]
      }
    })
    .then(function(messages) {
      var length = messages.length;
      var result = [];
      for(var i = 0 ; i < length ; i++) {
        var temp = support.messagesToArray(messages[i]);
        result = result.concat(temp);
      }
      cb(result);
    });
  }

  var getAllSendMessages = function(cb) {
    return new Promise(function(resolve, reject) {
      getAllMessages(function(messages) {
        var length = messages.length;
        var result = [];
        for(var i = 0 ;i < length; i++) {
          var message = messages[i];
          if(message.user == user.id) {
            result.push(message);
          }
        }
        resolve(support.sortMessages(result));
      });
    });
  }

  var getAllReceiveMessages = function(cb) {
    return new Promise(function(resolve, reject) {
      getAllMessages(function(messages) {
        var length = messages.length;
        var result = [];
        for(var i = 0 ;i < length; i++) {
          var message = messages[i];
          if(message.user != user.id) {
            result.push(message);
          }
        }
        resolve(support.sortMessages(result));
      });
    });
  }

  return {
    insertMessage: insertMessage,
    getAllReceiveMessages: getAllReceiveMessages,
    getAllSendMessages: getAllSendMessages
  }

}

module.exports = MessageService;
