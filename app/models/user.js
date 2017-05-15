'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is a required field'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'This is not a email'
        },
        notEmpty: {
          msg: 'Email is a required field'
        },
        isUnique: function (value, next) {
          var self = this;
          User.findOne({where: { email: value }})
          .then(function (user) {
                            // reject if a different user wants to use the same email
                            if (user && self.id !== user.id) {
                              return next('Email already in use');
                            }
                            return next();
                          })
          .catch(function (err) {
            return next(err);
          });
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is a required field"
        },
      }
    },
    googleId: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Relationship, {
          onDelete: "CASCADE",
          foreignKey: 'userId'
        });
        User.hasMany(models.Message, {
          onDelete: "CASCADE",
          foreignKey: 'userId'
        });
      }
    },
    instanceMethods: {
      authenticate: function(value) {
        if (bcrypt.compareSync(value, this.password))
          return true;
        return false;
      }
    }
  });

  User.beforeValidate(function(user, options, fn) {
    if(user.email) {
      user.email = user.email.toLowerCase();
    }
    return fn(null, user);
  });

  User.beforeCreate(function(user, options, fn) {
    bcrypt.hash(user.get('password'), 3, function(err, hash) {
      if (err) return fn(err);
      user.set('password', hash);
      return fn(null, user);
    });
  });

  User.beforeCreate(function(user, options, fn) {
    if(user.get('googleId')) {
      bcrypt.hash(user.get('googleId'), 10, function(err, hash) {
        if (err) return fn(err);
        user.set('googleId', hash);
        return fn(null, user);
      });
    } else {
      return fn(null, user);
    }
  });

  User.beforeUpdate(function(user, options, fn) {
    if(user.get('googleId')) {
      bcrypt.hash(user.get('googleId'), 10, function(err, hash) {
        if (err) return fn(err);
        user.set('googleId', hash);
        return fn(null, user);
      });
    } else {
      return fn(null, user);
    }
  });

  User.beforeUpdate(function(user, options, fn) {
    bcrypt.hash(user.get('password'), 3, function(err, hash) {
      if (err) return fn(err);
      user.set('password', hash);
      return fn(null, user);
    });
  });

  return User;
};
