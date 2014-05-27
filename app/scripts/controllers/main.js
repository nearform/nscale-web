'use strict';

angular.module('nfdWebApp').controller('MainCtrl', function ($scope, $http, $window, $location, auth, validator) {

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
    var creds = {
      email: $scope.input_email,
      password: $scope.input_password
    };

    if(validator.isEmpty(creds.email) || validator.isEmpty(creds.password)) {
      $scope.msg = msgmap['missing-fields'];
      return;
    }

    auth.login(creds, null, function(out) {
      $scope.msg = msgmap[out.why] || msgmap.unknown;
    });
  };

  $scope.signup = function(){
    var creds = {
      name: $scope.input_name,
      email: $scope.input_email,
      password: $scope.input_password
    };

    if(validator.isEmpty(creds.name) || validator.isEmpty(creds.email) || validator.isEmpty(creds.password)) {
      $scope.msg = msgmap['missing-fields'];
      return;
    }
    if(!validator.email(creds.email)) {
      $scope.msg = msgmap['invalid-email'];
      return;
    }
    if(!validator.password(creds.password)) {
      $scope.msg = msgmap['weak-password'];
      return;
    }

    auth.register(creds, null, function( out ){
      $scope.msg = msgmap[out.why] || msgmap.unknown;
    })
  };

});
