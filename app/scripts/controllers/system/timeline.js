'use strict';

angular.module('nfdWebApp').controller('TimelineCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, auth) {

	$scope.moment = function(dateISOString) {
    return {
      fromNow: function() {

        var date = new Date(dateISOString);
        date =   new Date( date.getTime() + ( date.getTimezoneOffset() * 60000 ) );

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }
    };
  };

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

      _.each($scope.timeline, function(t) {
        t.guid = guid();
      });

      var avatars = [];
      _.each($scope.timeline, function(t) {
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