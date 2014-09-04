
'use strict';

(function(){

	var ctrl_util_module = angular.module('ctrlUtilService', ['apiService']);

  // From http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
  var moment = function(dateISOString) {
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
            return interval + " mins ago";
        }
        return Math.floor(seconds) + " seconds ago";
      }
    };
  };

	ctrl_util_module.service('ctrlutil', function(api) {
    return {
      init: function($scope, cb) {

        $scope.moment = moment;

        $scope.user = null;
        $scope.show = false;

        $scope.btn_signout = function() {
          api.logout();
        }

        api.checkLoggedIn(function(user) {
          $scope.user = user;
          cb(user);
        });

      }
    };
  });

})();