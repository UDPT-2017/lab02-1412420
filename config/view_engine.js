function viewEngine(app) {
  // view engine setup
  var exphbs  = require('express-handlebars');
  var path = require('path');
  var truncatise = require('truncatise');
  // config view engine
  var hbs = exphbs.create({
    helpers: {
      getDate: function(date) {
        var d = new Date(date);
        return d.getDate();
      },
      getMonth: function(date) {
        var d = new Date(date);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames[d.getMonth()];
      },
      getStandardTime: function(date) {
        var d = new Date(date);
        return d.getHours() + 'h:' + d.getMinutes() + "m";
      },
      truncatise: function(html) {
        var options = {
          TruncateLength: 50,
          TruncateBy : "words",
          Strict : true,
          StripHTML : true,
          Suffix : ' ...'
        };
        return truncatise(html, options);
      }
    },
    defaultLayout: path.join(__dirname,'..', 'app','views','layouts', 'application'),
    partialsDir: path.join(__dirname,'..', 'app','views','partials'),
    extname: 'hbs'
  });
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname,'..', 'app','views'));
}

module.exports = viewEngine;
