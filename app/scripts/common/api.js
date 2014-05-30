
'use strict';

(function(){

  // TODO should be possible to override from config
  var apibase = 'http://localhost:3000/api/1.0';

	var api_module = angular.module('apiService', []);

  var apiLoggedInUser = null;

	api_module.service('api', function($http, $rootScope) {
    return {
      login: function(creds,win,fail){
        this.call('POST','/auth/login',creds,{},
          function(out){
            apiLoggedInUser = out;
            if( win ) {return win(out);}
          }
          ,fail);
      },
      checkLoggedIn: function(cb) {
        if (apiLoggedInUser) {return cb(apiLoggedInUser);}

        // TODO - Fix
        cb(null);
        // this.instance(function(out){
        //   if (out.user) {
        //     apiLoggedInUser = out.user;
        //     cb(out.user);
        //   }
        //   else {
        //     window.location.href='/';
        //   }
        // });
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
          data:data,
          cache:false,
          // TODO Hack, should be using some sort of auth token
          headers:{'X-UserId':((user && user.id) ? user.id : ''), 'Authorization':'Bearer ' + ((user && user.token) ? user.token : '')}
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
