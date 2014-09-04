/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

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

  api.post('/auth/instance', null, null, function(out){
    if (out.user) {
      $location.path('/home');
    } else {
      $scope.show = true;
    }
  });

	$scope.github_login = function() {
		api.githubLogin();
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

    api.login(creds, function(out){
      if (out.user) {$location.path('/home');}
    }, function(out) {
      $scope.msg = msgmap[out.why] || msgmap.unknown;
    });

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
