'use strict';

var seneca = require('seneca')();

var fs = require('node-fs')
var _  = require('underscore');

module.exports = function(app, config, cb) {

    function init() {

        seneca.log.info('seneca', 'init');

        initLevelDbFolder(config, function(err) {
            if (err) {return cb(err);}
            initSeneca();
        });
    }

    function initSeneca() {
        seneca.log.info('seneca', 'leveldb init', config.leveldb);
        seneca.use('level-store', config.leveldb);

        var mailOpts = config.mail;
        mailOpts.folder = mailOpts.folder || __dirname + '/../../email-templates';

        seneca.use('user',{confirm:true});
        // TODO Not working for some reason?
        // seneca.use('mail', mailOpts);
        seneca.use('auth', config.auth);
        seneca.use('account');
        seneca.use('project')
        seneca.use('settings')
        seneca.use('data-editor');
        seneca.use('admin');

        captureGithubEmail();

        // wait for all the seneca plugins to initialize
        seneca.ready(function(err){
            if( err ) process.exit( !console.error(err) );

            seneca.log.info('seneca', 'ready');

            app.use( seneca.export('web') );

            initStoreData();

            cb();
        });

    }

    function initLevelDbFolder(config, callback) {
        // If no folder set in config then return
        if (!config.leveldb || !config.leveldb.folder) {
            return callback();
        }

        // Make sure leveldb folder exists before setting up leveldb
        var folder = config.leveldb.folder + '/sys_entity';
        fs.exists(folder, function(exists){
          if(exists) {
            return callback();
          }

          fs.mkdir(folder, parseInt('0777', 8), true, function(err){
            if (err) {return callback(err);}
            callback();
          })
        });
    }

    function captureGithubEmail() {
        // Intercept github login and capture email
        var request = require('request');
        seneca.add({ role:'auth', trigger:'service-login' }, function(args,done){
          var instance = this;
          if (args.email || args.service != 'github') {
            return instance.prior(args,done);
          }
          var headers = {
            'User-Agent': 'nfd',
            'Content-Type' : 'application/json'
          };
          request({url: 'https://api.github.com/user/emails?access_token=' + args.credentials.token, headers: headers}, function(err, response, body) {
            if (!err) {
              var result = JSON.parse(body);
              for (var i = 0; i < result.length; i++) {
                if (result[i].primary) {
                  args.email = result[i].email;
                }
              }
            }
            return instance.prior(args, done);
          });
        });
    }

    function initStoreData() {
        seneca.log.info('store', 'init');

        // Define any extra entities
        seneca.act('role:util, cmd:define_sys_entity', {list:[]});

        // Create admin user if not already present
        var userent = seneca.make('sys/user');
        var u = seneca.pin({role:'user',cmd:'*'});

        var admin = config.admin || {email:'a1@example.com', name: 'admin', password:'a1'};
        userent.load$({email:admin.email}, function(err, user){
          if(!user) {
            seneca.log.info('adding admin user', admin.email);
            u.register({nick:admin.email, name:admin.name, email:admin.email, password:admin.password, active:true, admin:true});
          }
        });

        // Should only be registered in dev environment?
        var u1 = {
            email: 'u1@example.com',
            name: 'u1',
            password: 'u1'
        };
        userent.load$({email:u1.email}, function(err, user){
            if(!user) {
                seneca.log.info('adding user', u1.email);
                u.register({nick:u1.email, name:u1.name, email:u1.email, password:u1.password, active:true, admin:true});
            }
        });
    }

    init();

};

