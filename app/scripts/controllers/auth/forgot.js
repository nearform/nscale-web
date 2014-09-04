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
