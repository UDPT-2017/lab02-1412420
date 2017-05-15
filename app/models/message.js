'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is a required field'
        },
      }
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.User, {
          as: 'sender',
          foreignKey: {
            name: 'userId',
            allowNull: false
          }
        });
        Message.belongsTo(models.User, {
          as: 'receiver',
          foreignKey: {
            name: 'friendId',
            allowNull: false
          }
        });
      }
    }
  });
  return Message;
};
