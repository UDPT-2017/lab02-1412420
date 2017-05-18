
function MessageService(user) {

  var safeParse = require("safe-json-parse/tuple");
  var models = require('../models');
  // JSON
  // sUser
  // sName
  // rUser
  // rName
  // message
  // time
  // read
  // readTime
  // uid -> time in milisecond

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

  var insertMessage = function (message, anotherUser) {
    return new Promise(function (resolve, reject) {
      var messageInsert;
      getMessage(anotherUser)
      .spread(function(thisMessage, created) {
        var content = safeParse(thisMessage.content)[1];
        var length = Object.keys(content).length;
        messageInsert = {
          sUser: user.id,
          sName: user.name,
          rUser: anotherUser.id,
          rName: anotherUser.name,
          message: message,
          uid: Date.now(),
          time: new Date(),
          read: 0,
          readTime: 0
        }
        content[length + 1] = messageInsert;
        thisMessage.content = JSON.stringify(content);
        return thisMessage.save();
      })
      .then(function(m) {
        resolve(messageInsert);
      })
      .catch(function(error) {
        reject(error);
      });
    });
  }

  var insertArrayMessage = function(arrUsers, message) {
    return new Promise(function(resolve, reject) {
      models.User.findAll({
        where: {
          id: {
            $in: arrUsers
          }
        }
      })
      .then(function(users) {
        var l = users.length;
        var result = [];
        for(var i = 0 ; i < l ; i++) {
          result.push({
            message: message,
            userId: users[i].id
          });
          insertMessage(message, users[i]);
        }
        resolve(result);
      }).
      catch(function(error) {
        reject(error);
      });
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

  var getAllSendMessages = function() {
    return new Promise(function(resolve, reject) {
      getAllMessages(function(messages) {
        var length = messages.length;
        var result = [];
        for(var i = 0 ;i < length; i++) {
          var message = messages[i];
          if(message.sUser == user.id) {
            result.push(message);
          }
        }
        resolve(support.sortMessages(result));
      });
    });
  }

  var getAllReceiveMessages = function() {
    return new Promise(function(resolve, reject) {
      getAllMessages(function(messages) {
        var length = messages.length;
        var result = [];
        for(var i = 0 ;i < length; i++) {
          var message = messages[i];
          if(message.rUser == user.id) {
            result.push(message);
          }
        }
        resolve(support.sortMessages(result));
      });
    });
  }

  var getMessageByTwoUser = function(anotherUserId) {
    return models.Message.findOne({
      where: {
        $or: [
          { userId: user.id, friendId: anotherUserId },
          { userId: anotherUserId, friendId: user.id },
        ]
      }
    });
  }

  var updateReadMessage = function(uid, anotherUserId) {
    return new Promise(function(resolve, reject) {
      var messageFind;
      getMessageByTwoUser(anotherUserId)
      .then(function(message) {
        if(!message) {
          reject("INTERNAL QUERY ERROR");
        }
        var content = safeParse(message.content)[1];
        var length = Object.keys(content).length;
        for(var i = 0 ; i < length ; i++) {
          if(content[i + 1].uid.toString() == uid.toString()){
            messageFind = content[i + 1];
            break;
          }
        }
        if(!messageFind) {
          reject("MESSAGE WITH UID " + uid + " NOT FOUND");
        } else {
          if(messageFind.read != 1) {
            messageFind.read = 1;
            messageFind.readTime = new Date();
            message.content = JSON.stringify(content);
          }
          return message.save();
        }
      })
      .then(function(updatedMessage) {
        resolve(messageFind);
      });
    })
  }

  return {
    insertMessage: insertMessage,
    getAllReceiveMessages: getAllReceiveMessages,
    getAllSendMessages: getAllSendMessages,
    updateReadMessage: updateReadMessage,
    insertArrayMessage: insertArrayMessage
  }
}

module.exports = MessageService;
