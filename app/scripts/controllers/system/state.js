'use strict';

angular.module('nfdWebApp').controller('StateCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId + '/deployed', user, function(system){
        $scope.systemName = system.name;
        $scope.show = true;
    });
  });

});