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

    // TODO Replace with angular validation
    if (!$scope.system.name) {$scope.msg = 'Please specify system name'; return;}
    if (validator.hasSpaces($scope.system.name)) {$scope.msg = 'System name must have no spaces'; return;}

    api.put('/system/' + $scope.system.id, $scope.system, $scope.user, function(result){
      $scope.msg = 'System updated';
      $location.path('/home');
    });
  }

});