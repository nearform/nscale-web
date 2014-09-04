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

angular.module('nfdWebApp').controller('TimelineCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, auth) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
    	$scope.systemId = system.id;
      $scope.systemName = system.name;
      loadSystemTimeline(function() {
      	$scope.show = true;
      });
    });
  });

  var loadSystemTimeline = function(cb) {
  	api.get('/timeline?systemId=' + $scope.systemId, $scope.user, function(result){
      $scope.timeline = result;

      _.each($scope.timeline.entries, function(t) {
        t.guid = guid();
      });

      var avatars = [];
      _.each($scope.timeline.entries, function(t) {
        if (t.user === $scope.user.id) {
          t.avatar = $scope.user.avatar;
        }
        else {
          // Look in avatars first so not to repeat AUTH API calls
          if (avatars[t.user]) {
            t.avatar = avatars[t.user];
          }
          else {
            auth.avatar(t.user, function(avatar) {
              t.avatar = avatar;
              avatars[t.user] = t.avatar;
            });
          }
        }
      });

      cb();
    });
  };

  var guid = function() {
    // http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  $scope.share = function() {
    if (isBlank($scope.shareMessage)) {
      $scope.msg = "Message can't be blank";
      return;
    }
    var timelineDetails = {
        user: $scope.user.id,
        systemId: $scope.systemId,
        containerId: null,
        type: 'share',
        data: {text:$scope.shareMessage}
    }
    api.post('/timeline',timelineDetails, $scope.user, function(result){
      $scope.msg = "Message shared";
      console.log("Timeline build event posted successfully");
      $window.location.href = $window.location.href;
    });
  };

});
