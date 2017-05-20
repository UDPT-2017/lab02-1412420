function middleware(app, express) {

  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  app.use(favicon(path.resolve(__dirname,'..', 'app', 'assets','images', 'favicon1a.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, '..', 'app', 'assets'), { redirect : false }));
  app.use('/components', express.static(path.join(__dirname, '..', 'bower_components'), { redirect : false }));
}

module.exports = middleware;
