'use strict';

angular.module('nfdWebApp').controller('RevisionsCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, socket) {

  var loadRevisions = function(systemId, callback) {
    api.get('/system/' + systemId + '/revisions', $scope.user, function(revisions) {
      $scope.revisions = revisions;
      callback(revisions);
    });
  };

  var loadSystem = function() {
    api.get('/system/' + $scope.systemId + '/deployed', $scope.user, function(system){
      $scope.system = system;
      $scope.systemName = system.name;
      $scope.containers = system.containerDefinitions;

      loadRevisions($scope.systemId, function(revisions) {
        $scope.show = true;
      });
    });
  };

  // Init
  ctrlutil.init($scope, function(user) {
    $scope.systemId = $routeParams.systemId;
    loadSystem();
  });

  // scope build variables
  $scope.show_build = false;
  $scope.show_spinner = false;
  $scope.buildOutput = [];
  $scope.progress = 0;

  // Handle build output
  socket.on('stdout', function (out) {
      var outJson = JSON.parse(out);
      console.log(outJson);

      if (outJson.level !== 'debug' && outJson.level !== 'progress') {
        $scope.buildOutput.push({text:outJson.stdout, type:outJson.level});
      }
      else if (outJson.level === 'progress') {
        $scope.progress = Math.ceil(outJson.stdout);
      }
  });
  socket.on('stderr', function (out) {
      var outJson = JSON.parse(out);
      console.log(outJson);
      // TODO Hack, this error should not be coming from backend, remove once fixed!
      if (outJson.stderr.indexOf('Pseudo-terminal') !== 0 && outJson.stderr.indexOf('Usage: docker') !== 0) {
        $scope.buildOutput.push({text:outJson.stderr, type:'error'});
      }
  });
  socket.on('result', function (out) {
      $scope.show_spinner = false;
      $scope.progress = 100;
      console.log(out);
      $scope.buildOutput.push({text:out, type:'result'});
      loadSystem();
  });

  // Deploy trigger
  $scope.deploy = function(systemId, revisionId){
    console.log('Deploying system revision', systemId, revisionId);

    $scope.show_build = true;
    $scope.show_spinner = true;
    $scope.progress = 0;

    $scope.buildOutput.splice(0, $scope.buildOutput.length);

    socket.emit('system/deploy', {accessToken: $scope.user.token, systemId:systemId, revisionId:revisionId}, function (data) {
      console.log('deploy emitted');
      console.log(data);
    });
  }

});
