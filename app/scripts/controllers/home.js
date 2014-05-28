'use strict';

angular.module('nfdWebApp').controller('HomeCtrl', function ($scope, $http, $location, ctrlutil, api, validator) {

	// Init
  ctrlutil.init($scope, function(user) {
    api.get('/systems', user, function(systems){
      $scope.systems = systems;
      $scope.show = true;
    });
  });

  // System save
  $scope.save = function() {
    $scope.saveClicked = true;
    if ($scope.form.$invalid) {
      return;
    }

    // Remove any leading or traling whitespace
    $scope.systemName = $scope.systemName.trim();

    api.post('/system', {name:$scope.systemName}, $scope.user, function(system){
      $scope.msg = 'System saved';
      console.log(system);
      $location.path('/home');
    });
  }

	// System delete
  $scope.delete = function(system){
    var r = confirm("Are you sure?");
    if (!r) {return;}
  	api.del('/system/' + system.id, $scope.user, function(result){
      console.log('System deleted');
      var index = $scope.systems.indexOf(system);
  		$scope.systems.splice(index,1);
    });
	}

});