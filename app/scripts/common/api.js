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
