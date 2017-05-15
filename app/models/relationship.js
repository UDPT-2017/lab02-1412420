'use strict';
module.exports = function(sequelize, DataTypes) {
  var Relationship = sequelize.define('Relationship', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        Relationship.belongsTo(models.User, {
          as: 'owner',
          foreignKey: {
            name: 'userId',
            allowNull: false
          }
        });
        Relationship.belongsTo(models.User, {
          as: 'friend',
          foreignKey: {
            name: 'friendId',
            allowNull: false
          }
        });
      }
    }
  });
  return Relationship;
};
