'use strict';

angular.module('nfdWebApp').controller('HomeCtrl', function ($scope, $http, api) {

	var user = {id:"1"};

	api.get('/systems', user, function(systems){
    $scope.systems = systems;
    $scope.show = true;
  });

});