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

angular.module('nfdWebApp').controller('SettingsCtrl', function ($scope, $http, ctrlutil, auth, validator) {

  var msgmap = {
    'unknown': 'Unable to perform your request at this time - please try again later.',
    'missing-fields': 'Please enter the missing fields.',
    'user-updated': 'Your user details have been updated.',
    'user-exists-email': 'A user with that email already exists.',
    'user-exists-nick': 'A user with that username already exists.',
    'weak-password': 'That password is too weak.',
    'password-mismatch': 'Password and repeat password do not match.',
    'password-updated': 'Your password has been updated.'
  }

  // Init
  ctrlutil.init($scope, function(user) {
    $scope.field_name  = user.name;
    $scope.field_email = user.email;
    $scope.show = true;
  });

  $scope.update_user = function() {
    // TODO Implement using api and not auth
    alert('Not yet implemented');
    return;

    var creds = {name:  $scope.field_name, email: $scope.field_email};

    if(validator.isEmpty(creds.name) || validator.isEmpty(creds.email)) {
      $scope.msg = msgmap['missing-fields'];
      return;
    }
    if(!validator.email(creds.email)) {
      $scope.msg = msgmap['invalid-email'];
      return;
    }

    auth.update_user(creds,
      function(out){$scope.msg = msgmap['user-updated'];},
      function(out){$scope.msg = msgmap[out.why] || msgmap.unknown;}
    );
  };

  $scope.change_pass = function() {
    // TODO Implement using api and not auth
    alert('Not yet implemented');
    return;

    var data = {password: $scope.field_password, repeat: $scope.field_repeat};

    if(validator.isEmpty(data.password) || validator.isEmpty(data.repeat)) {
      $scope.password_msg = msgmap['missing-fields'];
      return;
    }
    if(!validator.password(data.password)) {
      $scope.password_msg = msgmap['weak-password'];
      return;
    }
    if(data.password !== data.repeat) {
      $scope.password_msg = msgmap['password-mismatch'];
      return;
    }

    auth.change_password(data,
      function( out ){$scope.password_msg = msgmap['password-updated'];},
      function( out ){$scope.password_msg = msgmap[out.why] || msgmap.unknown;}
    );
  };

});
