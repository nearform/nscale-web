'use strict';

angular.module('nfdWebApp').controller('TimelineCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, auth) {

  // TODO Refactor into its own module - also in state.js
  // From http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
	$scope.moment = function(dateISOString) {
		return {
		  fromNow: function() {

        // From http://stackoverflow.com/questions/15517024/convert-iso-date-string-in-javascript-to-date-object-without-converting-to-loca
		    var date = new Date(dateISOString);
		    date =   new Date( date.getTime() + ( date.getTimezoneOffset() * 60000 ) );

		    var seconds = Math.floor((new Date() - date) / 1000);

		    var interval = Math.floor(seconds / 31536000);

		    if (interval > 1) {
		        return interval + " years ago";
		    }
		    interval = Math.floor(seconds / 2592000);
		    if (interval > 1) {
		        return interval + " months ago";
		    }
		    interval = Math.floor(seconds / 86400);
		    if (interval > 1) {
		        return interval + " days ago";
		    }
		    interval = Math.floor(seconds / 3600);
		    if (interval > 1) {
		        return interval + " hours ago";
		    }
		    interval = Math.floor(seconds / 60);
		    if (interval > 1) {
		        return interval + " minutes ago";
		    }
		    return Math.floor(seconds) + " seconds ago";
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
