
'use strict';

(function(){

	var ctrl_util_module = angular.module('ctrlUtilService', ['authService']);

	ctrl_util_module.service('ctrlutil', function(auth) {
    return {
      init: function($scope, cb) {

        $scope.user = null;
        $scope.show = false;

        auth.checkLoggedIn(function(user) {
          $scope.user = user;
          cb(user);
        });

        $scope.btn_signout = function() {
          auth.logout();
        }

      }
    };
  });

})();