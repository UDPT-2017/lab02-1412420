'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);

var baseCtrlName    = 'controller.js';
var baseCtrlLength  = baseCtrlName.length;
var controllers     = {}

fs
  .readdirSync(__dirname)
  .filter(function (file){
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-baseCtrlLength).toLowerCase() === baseCtrlName);
  })
  .forEach(function(file) {
    var fileName = file.slice(0, file.length - baseCtrlLength).toLowerCase();
    controllers[fileName] = require('./' + file);
  });

module.exports = controllers;
