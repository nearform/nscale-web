'use strict';

angular.module('nfdWebApp').controller('SystemCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, validator) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system) {
      $scope.system = system;
      $scope.show = true;
    });
  });

  // System update
  $scope.update = function() {
    $scope.updateClicked = true;
    if ($scope.form.$invalid) {
      return;
    }
    // Remove any leading or traling whitespace
    $scope.system.name = $scope.system.name.trim();

    api.put('/system/' + $scope.system.id, $scope.system, $scope.user, function(result){
      $scope.msg = 'System updated';
      $location.path('/home');
    });
  }

});