'use strict';

angular.module('nfdWebApp').controller('ContainerCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
      $scope.systemId = system.id;
      $scope.systemName = system.name;
      $scope.show = true;
    });
  });

  $scope.container = {};
  $scope.save = function() {

    // TODO Only save specific properties that are associated with container type

    // TODO Get repository token if user does not have the credentials
    var user = $scope.user;
    if (user.service && user.service.github && user.service.github.credentials) {
        if (!$scope.container.specific) {
            $scope.container.specific = {};
        }
        $scope.container.specific.repositoryToken = user.service.github.credentials.token;
    }

    console.dir($scope.container);

    api.post('/system/' + $scope.systemId + '/container', $scope.container, $scope.user, function(result){
        $scope.msg = 'Container saved';
        $location.path('/system/' + $scope.systemId);
    });
  }

});