'use strict';

angular.module('nfdWebApp').controller('ContainerCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
      $scope.systemId = system.id;
      $scope.systemName = system.name;

      $scope.container = {};
      if ($routeParams.containerId) {
        $scope.containerId = $routeParams.containerId;
        api.get('/system/' + $scope.systemId + '/containers', user, function(result){
            $scope.containers = result;

            for (var i = 0; i < result.length; i++) {
                var container = result[i];
                if (container.id === $scope.containerId) {
                    $scope.container = container;
                    break;
                }
            }
            $scope.show = true;
        });
      } else {
        $scope.show = true;
      }

    });
  });

  var setRepositoryToken = function() {
    // TODO Get repository token if user does not have the credentials
    var user = $scope.user;
    if (user.service && user.service.github && user.service.github.credentials) {
        if (!$scope.container.specific) {
            $scope.container.specific = {};
        }
        $scope.container.specific.repositoryToken = user.service.github.credentials.token;
    }
  };

  $scope.save = function() {

    // TODO Only save specific properties that are associated with container type

    setRepositoryToken();

    api.post('/system/' + $scope.systemId + '/container', $scope.container, $scope.user, function(result){
        $scope.msg = 'Container saved';
        $location.path('/system/' + $scope.systemId);
    });
  }

  $scope.update = function() {

    // TODO Only save specific properties that are associated with container type

    setRepositoryToken();
    api.put('/system/' + $scope.systemId + '/container/' + $scope.container.id, $scope.container, $scope.user, function(result){
        $scope.msg = 'Container updated';
        $location.path('/system/' + $scope.systemId);
    });
  }

});