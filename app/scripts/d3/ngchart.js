'use strict';

(function(){

  angular.module('ngchart', ['constants', 'apiService'])
    .directive('d3chart', function($window, api) {
      return {
        template: '<div id="systemstate" class="col-lg-12 d3chart"></div>',
        replace: false,
        restrict: 'EA',
        link: function(scope, element, attr, controller) {

          // TODO refactor into a d3 module - see http://bl.ocks.org/biovisualize/5372077#reusable_chart.js
          function init(root) {

            var margin = {
                top: 20,
                right: 120,
                bottom: 20,
                left: 120
            },
            width = 960 - margin.right - margin.left,
            height = 800 - margin.top - margin.bottom;

            var i = 0,
                duration = 750,
                rectW = 150,
                rectH = 60;

            var tree = d3.layout.tree().nodeSize([rectW + 10, rectH + 10]);
            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                return [d.x + rectW / 2, d.y + rectH / 2];
            });

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    var tooltip = "<strong>" + d.name + "</strong>";
                    if (d.containerId) {
                        tooltip += "<br/><small>" + d.containerType + "</small>";
                        tooltip += "<br/><small>" + d.containerId + "</small>";
                    }
                    return tooltip;
                });

            var zm;

            // remove latest chart so that it can be replaced
            d3.select("#d3chart").remove();

            var svg = d3.select("#systemstate").append("svg")
                .attr("id","d3chart")
                // set viewBox and preserveAspectRatio instead of width and height to make it responsive
                .attr("viewBox", "0 0 1000 600")
                .attr("preserveAspectRatio", "xMinYMin meet")
                // .attr("width", 1000).attr("height", 600)
                .call(zm = d3.behavior.zoom().scaleExtent([0.5,3]).on("zoom", redraw))
                .append("g")
                .attr("transform", "translate(" + 350 + "," + 20 + ")");

            svg.call(tip);

            //necessary so that zoom knows where to zoom and unzoom from
            zm.translate([350, 20]);

            root.x0 = 0;
            root.y0 = height / 2;

            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            // root.children.forEach(collapse);
            update(root);

            // d3.select("#systemstate").style("height", "800px");

            function update(source) {

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 125;
                });

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                    .on("click", click);

                nodeEnter.append("rect")
                    .attr("width", rectW)
                    .attr("height", rectH)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .style("fill", function (d) {
                        if (d.root) {return "#f8f8f8";}
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeEnter.append("text")
                    .attr("x", rectW / 2)
                    .attr("y", rectH / 2)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .text(function (d) {
                        return d.name;
                    })
                    .style("fill", function (d) {
                        return d.root ? "#4183c4" : "#333333";
                    });

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                nodeUpdate.select("rect")
                    .attr("width", rectW)
                    .attr("height", rectH)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .style("fill", function (d) {
                        if (d.root) {return "#f8f8f8";}
                        return d._children ? "lightsteelblue" : "#fff";
                    }
                );

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                    .remove();

                nodeExit.select("rect")
                    .attr("width", rectW)
                    .attr("height", rectH)
                //.attr("width", bbox.getBBox().width)""
                //.attr("height", bbox.getBBox().height)
                .attr("stroke", "black")
                    .attr("stroke-width", 1);

                nodeExit.select("text");

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function (d) {
                    return d.target.id;
                });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("x", rectW / 2)
                    .attr("y", rectH / 2)
                    .attr("d", function (d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

            //Redraw for zoom
            function redraw() {
              //console.log("here", d3.event.translate, d3.event.scale);
              svg.attr("transform",
                  "translate(" + d3.event.translate + ")"
                  + " scale(" + d3.event.scale + ")");
            }

          }

        // Wait for scope.user to become available before rendering chart
        scope.$watch('data', function(newValue, oldValue) {
          if (!newValue) {
            return;
          }
          init(newValue);
        });

      }
    };
  });

})();