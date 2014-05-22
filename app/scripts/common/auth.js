
'use strict';

(function(){

	var auth_module = angular.module('authService', []);

	auth_module.service('auth', function($http,$window) {
    return {
      checkLoggedIn: function(cb) {
        this.instance(function(out){
          if (out.user) {
            cb(out.user);
          }
          else {
            window.location.href='/';
          }
        });
      },

      login: function(creds,win,fail){
        $http({method:'POST', url: '/auth/login', data:creds, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
            $window.location.href='/account';
            return;
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      register: function(details,win,fail){
        $http({method:'POST', url: '/auth/register', data:details, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
            $window.location.href='/account';
            return;
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      instance: function(win,fail){
        $http({method:'GET', url: '/auth/instance', cache:false}).
          success(function(data) {
            // Set github avatar if available and there isn't an avatar already set
            if (data.user && !data.user.avatar && data.user.service && data.user.service.github && data.user.service.github.userdata && data.user.service.github.userdata._json) {
              data.user.avatar = data.user.service.github.userdata._json.avatar_url;
            }
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      // TODO Hack - using json rest API to get other user's avatar (should be set by backend!)
      avatar: function(id, win,fail){
        $http({method:'GET', url: '/api/1.0/sys_user?id=' + id, cache:false}).
          success(function(user) {
            var avatar = user.avatar;
            // Get github avatar if available and there isn't an avatar already set
            if (!user.avatar && user.service && user.service.github && user.service.github.userdata && user.service.github.userdata._json) {
              avatar = user.service.github.userdata._json.avatar_url;
            }
            if( win ) {return win(avatar);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      reset: function(creds,win,fail){
        $http({method:'POST', url: '/auth/create_reset', data:creds, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      reset_load: function(creds,win,fail){
        $http({method:'POST', url: '/auth/load_reset', data:creds, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      reset_execute: function(creds,win,fail){
        $http({method:'POST', url: '/auth/execute_reset', data:creds, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      confirm: function(creds,win,fail){
        $http({method:'POST', url: '/auth/confirm', data:creds, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      logout: function(win,fail){
        $http({method:'POST', url: '/auth/logout', cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
            $window.location.href='/';
            return;
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      change_password: function(creds,win,fail){
        $http({method:'POST', url: '/auth/change_password', data:creds, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      update_user: function(fields,win,fail){
        $http({method:'POST', url: '/auth/update_user', data:fields, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      },

      update_org: function(fields,win,fail){
        $http({method:'POST', url: '/account/update', data:fields, cache:false}).
          success(function(data) {
            if( win ) {return win(data);}
          }).
          error(function(data) {
            if( fail ) {return fail(data);}
          });
      }
    };
  });

})();
