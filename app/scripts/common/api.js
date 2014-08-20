
'use strict';

(function(){

  var apibase = nfd.context.apiserver + nfd.context.apibase;

	var api_module = angular.module('apiService', []);

  var apiLoggedInUser = null;

	api_module.service('api', function($http, $rootScope) {
    return {
      login: function(creds,win,fail){
        this.call('POST','/auth/login',creds,{},
          function(out){
            apiLoggedInUser = out.user;
            if( win ) {return win(out);}
          }
          ,fail);
      },

      githubLogin: function(){
        window.location.href=apibase+'/auth/github';
      },

      checkLoggedIn: function(cb) {
        if (apiLoggedInUser) {return cb(apiLoggedInUser);}

        this.call('POST','/auth/instance',null,{},
          function(out){
            if (out.user) {
              apiLoggedInUser = out.user;
              cb(apiLoggedInUser);
            }
            else {
              window.location.href='/';
            }
          }
          ,function(out) {
            window.location.href='/';
          });
      },
      logout: function(){
        this.call('POST','/auth/logout',null,{},
          function(out){
            apiLoggedInUser = null;
            window.location.href='/';
          }
          ,null);
      },

      get: function(path,user,win,fail){
        this.call('GET',path,null,user,win,fail);
      },
      post: function(path,data,user,win,fail){
        this.call('POST',path,data,user,win,fail);
      },
      put: function(path,data,user,win,fail){
        this.call('PUT',path,data,user,win,fail);
      },
      del: function(path,user,win,fail){
        this.call('DELETE',path,null,user,win,fail);
      },
      call: function(method,path,data,user,win,fail){
        var params = {
          method:method,
          url: apibase+path,
          withCredentials: true, // TODO is this a good idea?
          data:data,
          cache:false,
          // TODO Hack, should be using some sort of auth token
          headers:{'Authorization':'Bearer ' + ((user && user.token) ? user.token : '')}
        };

        $http( params ).
          success(function(out) {
            if( win ) {return win(out);}
          }).
          error(function(out) {
            if( fail ) {return fail(out);}
          });
      }
    };
  });

})();
