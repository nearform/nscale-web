'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  apiserver: 'http://localhost:3000',
  apibase: '/api/1.0'
};