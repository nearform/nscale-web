'use strict';

angular.module('nfdWebApp').controller('ActionBarCtrl', function ($scope, $location) {

	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};

});
