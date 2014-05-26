'use strict';

angular.module('nfdWebApp').controller('HomeCtrl', function ($scope, $http, $window, auth, api, validator) {

	// Init scope
  function init(user) {
    $scope.user = user;
    api.get('/systems', user, function(systems){
      $scope.systems = systems;
      $scope.show = true;
    });
  }

  // Auth
  $scope.user = null;
  $scope.show = false;
  auth.checkLoggedIn(function(user) {init(user);});
  $scope.btn_signout = function() {auth.logout();}

  // System save
  $scope.save = function() {
    if (!$scope.systemName) {
      $scope.msg = 'Please specify system name';
      return;
    }
    if (validator.hasSpaces($scope.systemName)) {
      $scope.msg = 'System name must have no spaces';
      return;
    }
    api.post('/system', {name:$scope.systemName}, $scope.user, function(system){
      $scope.msg = 'System saved';
      console.log(system);
      $window.location.href = '/home';
    });
  }

	// System delete
  $scope.delete = function(systemId) {
    api.del('/system/' + systemId, $scope.user, function(result){
      console.log('System deleted');
      $window.location.href = $window.location.href;
    });
  }

});