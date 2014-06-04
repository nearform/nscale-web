
'use strict';

(function(){

	var ctrl_util_module = angular.module('ctrlUtilService', ['apiService']);

	ctrl_util_module.service('ctrlutil', function(api) {
    return {
      init: function($scope, cb) {

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