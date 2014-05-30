'use strict';

angular.module('nfdWebApp').controller('ContainersCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, containerTypes, socket) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
      $scope.systemId = system.id;
      $scope.systemName = system.name;
      $scope.containers = system.containerDefinitions;
      $scope.show = true;
    });
  });

  // scope build variables
  $scope.show_build = false;
  $scope.buildOutput = [];

  // Handle build output
  socket.on('stdout', function (out) {
    console.log(out);
    $scope.buildOutput.push({text:out, type:'out'});
  });
  socket.on('stderr', function (out) {
    console.log(out);
    $scope.buildOutput.push({text:out, type:'error'});
  });
  socket.on('result', function (out) {
    console.log(out);
    $scope.buildOutput.push({text:out, type:'result'});
  });

  $scope.resolveType = function(type){return containerTypes[type];}

  $scope.delete = function(systemId, container) {
    var r = confirm("Are you sure?");
    if (!r) {return;}
    api.del('/system/' + systemId + '/container/' + container.id, $scope.user, function(result){
      console.log('Container deleted');
      var index = $scope.containers.indexOf(container);
      $scope.containers.splice(index,1);
    });
  }

  // Deploy trigger
  $scope.deploy = function(systemId){
    console.log('Deploying system', systemId);

    $scope.show_build = true;

    $scope.buildOutput.splice(0,$scope.buildOutput.length);

    socket.emit('system/deploy', {user: $scope.user, accessToken: $scope.user.token, systemId: systemId}, function (data) {
      console.dir('deploy emitted');
      console.dir(data);
    });
  }

});