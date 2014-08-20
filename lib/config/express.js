'use strict';

var express = require('express'),
    expstate = require('express-state'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config');

/**
 * Express configuration
 */
module.exports = function(app) {
  var env = app.get('env');

  // Express-State configuration
  expstate.extend(app);
  app.set('state namespace', 'nfd.context');
  app.use(function(req, res, next) {
    res.expose(config.apiserver, 'apiserver');
    res.expose(config.apibase, 'apibase');
    next();
  });

  if ('development' === config.env) {
    // TODO Needed?
    // app.use(require('connect-livereload')());
    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.set('views', config.root + '/app/views');
  }

  if ('production' === config.env) {
    app.use(compression());
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    //app.set('views', config.root + '/views');
    app.set('views', config.root + '/app/views');
  }

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(methodOverride());

  // Error handler - has to be last
  if ('development' === config.env) {
    app.use(errorHandler());
  }
};
