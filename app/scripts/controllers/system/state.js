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

  var ellipsis = function(s, length) {
    return s.length > length ? s.substr(0, length - 1) + '...' : s;
  };
  $scope.ellipsis = ellipsis;

	var initSystemState = function(system) {

		var containers = {};
	  for (var i = 0; i < system.containerDefinitions.length; i++) {
	    var container = system.containerDefinitions[i];
	    containers[container.id] = {id:container.id, name:container.name, type:container.type};
	  }

	  var allTopologies = {};
	  angular.forEach(system.topology.containers, function(containerTopology, key) {
	    this[containerTopology.id] = containerTopology;
	  }, allTopologies);

	  angular.forEach(system.topology.containers, function(containerTopology, key) {
	  	angular.forEach(containerTopology.contains, function(containerTopologyId, key) {
	  		this[containerTopologyId].parent = containerTopology.id;
	  	}, allTopologies);
	  });

	  var parentTopologies = [];
	  angular.forEach(allTopologies, function(containerTopology, key) {
	  	if (!containerTopology.parent) {
	  		this.push(containerTopology);
	  	}
	  }, parentTopologies);

	  var data = {
	  	name: 'System State',
	  	root: true,
	  	children: []
	  };

	  angular.forEach(parentTopologies, function(parentTopology, key) {

	    function pushData(childrenRoot, containerTopology) {

	      var containerDefinition = containers[containerTopology.containerDefinitionId];

	      var child = {
	      	name: ellipsis(containerDefinition.name, 20),
	      	containerId: containerDefinition.id,
	      	containerType: containerDefinition.type
	      };
	      if (containerTopology.contains.length > 0) {
	      	child.children = [];
	      }
	      childrenRoot.push(child);

	      angular.forEach(containerTopology.contains, function(containerTopologyId, key) {
	        pushData(child.children, allTopologies[containerTopologyId]);
	      });
	    }

	    var parent = {
	      	name: ellipsis(containers[parentTopology.containerDefinitionId].name, 20),
	      	containerId: containers[parentTopology.containerDefinitionId].id,
	      	containerType: containers[parentTopology.containerDefinitionId].type
	    };
	    if (parentTopology.contains.length > 0) {
	      parent.children = [];
	    }
	    this.children.push(parent);

	    angular.forEach(parentTopology.contains, function(containerTopologyId, key) {
	        pushData(parent.children, allTopologies[containerTopologyId]);
	    });

	  }, data);

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