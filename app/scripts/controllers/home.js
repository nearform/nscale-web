'use strict';

angular.module('nfdWebApp').controller('HomeCtrl', function ($scope, $http, $window, auth, api) {

  function init(user) {
    $scope.user = user;
    api.get('/systems', user, function(systems){
      $scope.systems = systems;
      $scope.show = true;
    });
  }

  $scope.user = null;
  $scope.show = false;
  auth.checkLoggedIn(function(user) {init(user);});
  $scope.btn_signout = function() {auth.logout();}

  $scope.delete = function(systemId) {
    api.del('/system/' + systemId, $scope.user, function(result){
      console.log('System deleted');
      $window.location.href = $window.location.href;
    });
  }

});