'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,

  admin: {
    email: 'a1@example.com',
    name: 'admin',
    password: 'a1'
  },

  leveldb: {
    folder:'db'
  },

  mail: {
  	mail: {from:'youremail@example.com'},
    config:{
      host: 'localhost'
    }
  },

  auth: {
    sendemail:false,
    email:{
      subject: {
        register:"Welcome!",
        create_reset:"Password Reset"
      },
      content: {
        resetlinkprefix:"http://localhost:9000/reset",
        confirmlinkprefix:"http://localhost:9000/confirm"
      }
    },
    service: {
      github: {
        clientID: '9e1c7f0437cc0c3d21b6',
        clientSecret: '78f2904a908336a509b0a8bbbd502049fd3e749a',
        urlhost: 'http://localhost:9000',
        // see https://developer.github.com/v3/oauth/#scopes
        scope: ['repo', 'user:email']
      }
    },
    redirect: {
      login:         {win:'/home',fail:'/',},
      register:      {win:'/home',fail:'/',}
    }
  }

};