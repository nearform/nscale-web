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

  // System clone
  $scope.clone = function() {
    $scope.cloneClicked = true;
    if ($scope.form.$invalid) {
      return;
    }

    // Remove any leading or traling whitespace
    $scope.url = $scope.url.trim();

    api.post('/system/clone', {url:$scope.url}, $scope.user, function(system){
      $scope.msg = 'System cloned';
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