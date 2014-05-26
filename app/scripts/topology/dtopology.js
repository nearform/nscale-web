'use strict';

(function(){

  var googleLoaded = false;
  google.setOnLoadCallback(function () {
    googleLoaded = true;
  });

  google.load('visualization', '1', {packages:['orgchart']});

  angular.module('topologyDirectives', ['constants', 'apiService'])
    .directive('topologyVisualizer', function($window, api) {
      return {
        template: '<div id="topology" class="topology"></div>',
        replace: false,
        restrict: 'EA',
        link: function(scope, element, attr, controller) {

          var urlPaths = $window.location.href.split('/');
          scope.systemId = urlPaths.pop() && urlPaths.pop();

          function drawTopology(i, data) {
            // Create and draw the visualization.
            new google.visualization.OrgChart(document.getElementById('topology' + i)).
                draw(google.visualization.arrayToDataTable(data), {allowHtml: true});
          }

          function init() {

            // TODO URL should come from config
            console.log('topology visualization - get deployed system');

            api.get('/system/' + scope.systemId + '/deployed', scope.user, function( system ) {
              console.log(system);

              $('#topology').addClass(system.name.toLowerCase().split(' ').join('_'));

              var containers = {};
              for (var i = 0; i < system.containerDefinitions.length; i++) {
                var container = system.containerDefinitions[i];
                containers[container.id] = {id:container.id, name:container.name, type:container.type};
              }

              var allTopologies = {};
              var parentTopologies = [];
              $.each(system.topology.containers, function(key, containerTopology) {
                allTopologies[containerTopology.id] = containerTopology;
                if (containerTopology.id === containerTopology.containedBy) {
                  parentTopologies.push(containerTopology);
                }
              });

              $.each(parentTopologies, function(key, parentTopology) {
                // Create and populate the data table.
                var data = [
                  ['Node', 'Parent', 'Tooltip']
                  // ['Mike', null, 'The President'],
                  // [{v: 'Jim', f: 'Jim<br/><small>AMI</small>'}, 'Mike',    null],
                  // ['Alice', 'Mike', null],
                  // ['Bob', 'Jim', 'Bob Sponge']
                ];

                function pushData(containerTopology) {
                  var node = {
                    v:containerTopology.id
                  };

                  var containerDefinition = containers[containerTopology.containerDefinitionId];
                  if (containerDefinition) {
                    node.f =
                      '<a href="/system/' + system.id + '/container/' + containerDefinition.id + '">' +
                      '<div>' +
                      '<span>' + containerDefinition.name + '</span>' +
                      '<br/>' +
                      '<small>' + containerDefinition.type + '</small>' +
                      '<br/>' +
                      '<small class="tiny">[' + containerDefinition.id + ']</small>' +
                      '</div>' +
                      '</a>';
                  }

                  var parent = (containerTopology.containedBy && containerTopology.containerBy !== containerTopology.id)
                    ? containerTopology.containedBy : null;

                  data.push([node, parent, null]);

                  $.each(containerTopology.contains, function(key, containerTopologyId) {
                    pushData(allTopologies[containerTopologyId]);
                  });
                }
                console.log(parentTopology);
                pushData(parentTopology);

                $('#topology').append('<div id="topology' + key + '" class="topology-child"></div>');
                // console.log(data);
                drawTopology(key, data);
              });

              // TODO Remove - one org chart

              // $.each(system.topology.containers, function(key, containerTopology) {
              //   var node = {
              //     v:containerTopology.id
              //   };

              //   var containerDefinition = containers[containerTopology.containerDefinitionId];
              //   if (containerDefinition) {
              //     node.f =
              //       '<a href="/system/' + system.id + '/container/' + containerDefinition.id + '">' +
              //       '<div>' +
              //       '<span>' + containerDefinition.name + '</span>' +
              //       '<br/>' +
              //       '<small>' + containerDefinition.type + '</small>' +
              //       '<br/>' +
              //       '<small class="tiny">[' + containerDefinition.id + ']</small>' +
              //       '</div>' +
              //       '</a>';
              //   }

              //   var parent = (containerTopology.containedBy && containerTopology.containerBy !== containerTopology.id)
              //     ? containerTopology.containedBy : null;

              //   if (containerTopology.id === containerTopology.containedBy) {
              //     console.log(containerDefinition.name);
              //   }

              //   data.push([node, parent, null]);
              // });

              // Include containers that have not been linked
              /*
              $.each(containers, function(key, container) {
                if (!container.linked) {
                  data.push([{v:container.name, f:'<a href="/system/' + systemId + '/container/' + container.id + '">' + container.name+'<br/><small>' + container.type + '</small></a>'}, null, null]);
                  // nodes[container.name] = {name: container.name};
                }
              });
              */

              // console.log(data);
              // drawTopology(data);
            });

          }

        // Wait for scope.user to become available before rendering chart
        scope.$watch('user', function(newValue, oldValue) {
          if (!newValue) {
            return;
          }
          if (!googleLoaded) {
            google.setOnLoadCallback(function () {
              init();
            });
          } else {
            init();
          }
        });

      }
    };
  });

})();
