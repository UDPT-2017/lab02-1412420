function configRouting(app) {
  var controllers = require('../app/controllers');
  app.use('/', controllers.index);
  app.use('/users', controllers.users);
}

module.exports = configRouting;
