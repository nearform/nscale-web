
'use strict';

(function(){

  var containerTypes = {
    'aws-ami': 'AMI',
    'aws-elb': 'Load balancer',
    'aws-sg': 'Security group',
    'docker': 'Docker container'
  };

	var constants_module = angular.module('constants', []);

	constants_module.constant('containerTypes', containerTypes);

})();
