'use strict';

angular.module('nfdWebApp').controller('ForgotCtrl', function ($scope, $http, auth, validator) {

	console.log('hello');
	var msgmap = {
    'unknown': 'Unable to perform your request at this time - please try again later.',
    'missing-email': 'Please enter the email address.',
    'invalid-email': 'That email address is not valid.',
    'user-not-found': 'That email address is not recognized.',
    'reset-sent': 'An email with password reset instructions has been sent to you.'
  };

	$scope.show = true;

	$scope.forgot = function() {
    var email = $scope.input_email;

    if(validator.isEmpty(email)) {
      $scope.msg = msgmap['missing-email'];
      return;
    }
    if(!validator.email(email)) {
      $scope.msg = msgmap['invalid-email'];
      return;
    }

    auth.reset({email: email},
    	function(){$scope.msg = msgmap['reset-sent'];},
    	function(out){$scope.msg = msgmap[out.why] || msgmap.unknown;}
    );
  };



});
