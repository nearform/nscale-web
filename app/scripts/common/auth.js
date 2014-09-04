/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

(function(){

	var auth_module = angular.module('authService', []);

  var loggedInUser = null;

	auth_module.service('auth', function($http,$window) {
    return {
      checkLoggedIn: function(cb) {
        if (loggedInUser) {return cb(loggedInUser);}
        this.instance(function(out){
          if (out.user) {
            loggedInUser = out.user;
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
            $window.location.href='/home';
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
            $window.location.href='/home';
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
        console.log('auth reset');
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
            loggedInUser = null;
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
