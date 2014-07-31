'use strict';

angular.module('nfdWebApp').controller('TargetStateCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, socket) {

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
        buildTree($scope.system);
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

  // https://github.com/JimLiu/angular-ui-tree
  $scope.treeOptions = {
    dropped: function(event) {

      var draggedContainer = event.source.nodeScope.$modelValue;
      var destinationContainer = event.dest.nodesScope.$parent.$modelValue;
      console.info(draggedContainer.id, 'dropped to', destinationContainer ? destinationContainer.id : 'root');

      // TODO: review, does a root level container actually need to be containedBy its own id?

      // get a reference to the container in the topology
      var tdc = $scope.topology[draggedContainer.id];

      // remove from parent container contains array first
      if (tdc.containedBy && tdc.containedBy !== tdc.id) {
        var tdcp = $scope.topology[tdc.containedBy];
        tdcp.contains.splice(tdcp.contains.indexOf(tdc.id), 1);
      }

      // set parent id
      tdc.containedBy = destinationContainer ? destinationContainer.id : draggedContainer.id;

      // add to new parent container contains array
      if (tdc.containedBy && tdc.containedBy !== tdc.id) {
        var tdcp = $scope.topology[tdc.containedBy];
        tdcp.contains.push(tdc.id);
      }

      $scope.canCommit = true;
    }
  };

  $scope.saveChanges = function() {
    console.log('Save', $scope.topology);

    var system = angular.copy($scope.system);
    system.topology.containers = $scope.topology;

    api.put('/system/' + $scope.systemId, system, $scope.user, function(result) {
      console.log('system saved');

      loadRevisions($scope.systemId, function(revisions) {
        var last = revisions[0];
        last.selected = true;

        buildTree(last.system);
      });
    });
  };

  var buildTree = function(system) {
    $scope.system = system;

    $scope.data = [];
    $scope.canCommit = false;
    $scope.containerDefinitions = _.indexBy(system.containerDefinitions, 'id');

    $scope.topology = angular.copy(system.topology.containers);
    $scope.originalTopology = angular.copy($scope.topology);

    // dump a flat structure
    // angular.forEach(topology, function(container, key) {
    //   container.containers = container.containers || [];
    //   $scope.data.push(container);
    // }

    _.each($scope.topology, function(container, key) {
      var uicontainer = angular.copy(container);
      if (!uicontainer.containedBy || uicontainer.containedBy === key) {
        uicontainer.contains = getChildren(container, $scope.topology);
        $scope.data.push(uicontainer);
      }
    });
  };

  var getChildren = function(container, topology) {
    if (!container.contains) return [];
    var children = _.map(_.values(_.pick(topology, container.contains)), function(container) { return angular.copy(container); });
    _.each(children, function(child) {
      child.contains = getChildren(child, topology);
    });
    return children;
  };

  $scope.selectRevision = function(revision) {
    angular.forEach($scope.revisions, function(revision) {
      revision.selected = false;
    });
    revision.selected = true;
    $scope.selectedRevision = revision;

    api.get('/system/' + $scope.systemId + '/revision/' + revision.id, $scope.user, function(revisionDetail) {
      buildTree(revisionDetail);
    });
  }

  // Deploy trigger
  $scope.deploy = function(systemId, revisionId){
    console.log('Deploying system revision', systemId, revisionId);

    $scope.show_build = true;
    $scope.show_spinner = true;
    $scope.progress = 0;

    $scope.buildOutput.splice(0,$scope.buildOutput.length);

    socket.emit('system/deploy', {accessToken: $scope.user.token, systemId:systemId, revisionId:revisionId}, function (data) {
      console.dir('deploy emitted');
      console.dir(data);
    });
  }

});