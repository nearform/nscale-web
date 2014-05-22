'use strict';

angular.module('nfdWebApp').controller('MainCtrl', function ($scope, $http, $window) {

	$scope.show = true;

	$scope.mode = 'none'
  $scope.user = null

  $scope.showmsg = false
  $scope.hide_cancel = true
  $scope.hide_send = true
  $scope.hide_forgot = false

  $scope.signup_hit = false
  $scope.signin_hit = false

  $scope.input_name = ''
  $scope.input_email = ''
  $scope.input_password = ''

  $scope.seek_name = false
  $scope.seek_email = false
  $scope.seek_password = false

  $scope.hasuser = !!$scope.user;

  // auth.instance(function(out){
  //   $scope.user = out.user
  //   $scope.hasuser = !!$scope.user
  //   $rootScope.$emit('instance',{user:out.user})
  // });

	$scope.github_login = function() {
		$window.location.href = '/auth/github';
	}

});
