'use strict';

angular.module('nfdWebApp').controller('StateCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api) {

	// TODO Refactor into its own module - also in timeline.js
	// From http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
	$scope.moment = function(dateISOString) {
		return {
		  fromNow: function() {

        // From http://stackoverflow.com/questions/15517024/convert-iso-date-string-in-javascript-to-date-object-without-converting-to-loca
		    var date = new Date(dateISOString);
		    date =   new Date( date.getTime() + ( date.getTimezoneOffset() * 60000 ) );

		    var seconds = Math.floor((new Date() - date) / 1000);

		    var interval = Math.floor(seconds / 31536000);

		    if (interval > 1) {
		        return interval + " years ago";
		    }
		    interval = Math.floor(seconds / 2592000);
		    if (interval > 1) {
		        return interval + " months ago";
		    }
		    interval = Math.floor(seconds / 86400);
		    if (interval > 1) {
		        return interval + " days ago";
		    }
		    interval = Math.floor(seconds / 3600);
		    if (interval > 1) {
		        return interval + " hours ago";
		    }
		    interval = Math.floor(seconds / 60);
		    if (interval > 1) {
		        return interval + " minutes ago";
		    }
		    return Math.floor(seconds) + " seconds ago";
		  }
		};
  };

  $scope.ellipsis = function(s, length) {
    return s.length > length ? s.substr(0, length - 1) + '...' : s;
  }

	var initSystemState = function(system) {

		var containers = {};
	  for (var i = 0; i < system.containerDefinitions.length; i++) {
	    var container = system.containerDefinitions[i];
	    containers[container.id] = {id:container.id, name:container.name, type:container.type};
	  }

	  var allTopologies = {};
	  var parentTopologies = [];
	  jQuery.each(system.topology.containers, function(key, containerTopology) {
	    allTopologies[containerTopology.id] = containerTopology;
	    if (containerTopology.id === containerTopology.containedBy) {
	      parentTopologies.push(containerTopology);
	    }
	  });

	  var data = {};

	  jQuery.each(parentTopologies, function(key, parentTopology) {

	    function pushData(childrenRoot, containerTopology) {

	      var containerDefinition = containers[containerTopology.containerDefinitionId];

	      var child = {
	      	name: containerDefinition.name
	      };
	      if (containerTopology.contains.length > 0) {
	      	child.children = [];
	      }
	      childrenRoot.push(child);

	      jQuery.each(containerTopology.contains, function(key, containerTopologyId) {
	        pushData(child.children, allTopologies[containerTopologyId]);
	      });
	    }

	    data.name = containers[parentTopology.containerDefinitionId].name;
	    data.children = [];
	    jQuery.each(parentTopology.contains, function(key, containerTopologyId) {
	        pushData(data.children, allTopologies[containerTopologyId]);
	    });

	  });

	  return data;
	};

	var loadDeployed = function(systemId, callback) {
    api.get('/system/' + systemId + '/deployed', $scope.user, function(system) {
      callback(system);
    });
  };

	var loadRevisions = function(systemId, callback) {
    api.get('/system/' + systemId + '/revisions', $scope.user, function(revisions) {
      callback(revisions);
    });
  };

  var getRevision = function(systemId, revisionId, callback) {
    api.get('/system/' + systemId + '/revision/' + revisionId, $scope.user, function(revisionDetail) {
      callback(revisionDetail);
    });
  }

  var selectRevision = function(revisionId) {
  	getRevision($scope.systemId, revisionId, function(revisionDetail) {
			$scope.system = revisionDetail;
			$scope.systemName = revisionDetail.name;
			$scope.data = initSystemState(revisionDetail);
			$scope.show = true;
		});
  }

  $scope.pickRevision = function() {
  	if ($scope.pickedRevisionId) {
  		console.log($scope.pickedRevisionId);
  		// Find picked revision
			for (var i = 0; i < $scope.revisions.length; i++) {
				var revision = $scope.revisions[i];
				if (revision.id === $scope.pickedRevisionId) {
					$scope.selectedRevision = revision;
					break;
				}
			}
  		selectRevision($scope.pickedRevisionId);
  	}
  }

  // Init
  ctrlutil.init($scope, function(user) {
  	$scope.systemId = $routeParams.systemId;

  	loadRevisions($scope.systemId, function(revisions) {
			$scope.revisions = revisions;

			// Find deployed revision
			for (var i = 0; i < revisions.length; i++) {
				if (revisions[i].deployed) {
					$scope.selectedRevision = revisions[i];
					$scope.pickedRevisionId = revisions[i].id;
					break;
				}
			}

			// TODO What if no revisions have yet to be deployed? pick latest one?
			if (!$scope.selectedRevision) {
				console.log("No revision deployed yet");
				return;
			}

			selectRevision($scope.selectedRevision.id);
  	});

  });

});