'use strict';

angular.module('nfdWebApp').controller('MainCtrl', function ($scope, $http, $window, $location, api, auth, ctrlutil, validator) {

  var msgmap = {
    'unknown': 'Unable to perform your request at this time - please try again later.',
    'missing-fields': 'Please enter the missing fields.',
    'invalid-email': 'That email address is not valid.',
    'weak-password': 'That password is too weak.',
    'user-not-found': 'That email address is not recognized.',
    'invalid-password': 'That password is incorrect',
    'email-exists': 'That email address is already in use. Please login, or ask for a password reset.',
    'nick-exists': 'That email address is already in use. Please login, or ask for a password reset.',
    'reset-sent': 'An email with password reset instructions has been sent to you.',
    'activate-reset': 'Please enter your new password.',
    'invalid-reset': 'This is not a valid reset.',
    'reset-done': 'Your password has been reset.',
    'confirmed': 'Your account has been confirmed',
    'invalid-confirm-code': 'That confirmation code is not valid.'
  };

  auth.instance(function(out){
    if (out.user) {
      $location.path('/home');
    } else {
      $scope.show = true;
    }
  });

	$scope.github_login = function() {
		$window.location.href = '/auth/github';
	};

  $scope.signin = function() {
    $scope.msg = null;
    $scope.signinClicked = true;
    $scope.signupClicked = false;
    if ($scope.form.email.$invalid || $scope.form.password.$error.required) {
      return;
    }
    var creds = {
      email: $scope.input_email,
      password: $scope.input_password
    };

    api.login(creds, function(user){
      if (user) {
        $location.path('/home');
      } else {
        // TODO
        // $scope.msg = msgmap[out.why] || msgmap.unknown;
        $scope.msg = msgmap.unknown;
      }
    });
    // auth.login(creds, null, function(out) {
    //   $scope.msg = msgmap[out.why] || msgmap.unknown;
    // });

  };

  $scope.signup = function(){
    $scope.msg = null;
    $scope.signupClicked = true;
    $scope.signinClicked = false;
    if ($scope.form.name.$invalid || $scope.form.email.$invalid || $scope.form.password.$invalid) {
      return;
    }
    var creds = {
      name: $scope.input_name,
      email: $scope.input_email,
      password: $scope.input_password
    };

    // Hack that does validation manually because done angular way breaks signin :/
    $scope.form.password.$error.weak = false;
    if(!validator.password(creds.password)) {
      $scope.form.password.$invalid = true;
      $scope.form.password.$error.weak = true;
      return;
    }

    auth.register(creds, null, function( out ){
      console.log(out);
      $scope.msg = msgmap[out.why] || msgmap.unknown;
    })
  };

});
