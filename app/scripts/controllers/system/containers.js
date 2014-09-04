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

angular.module('nfdWebApp').controller('ContainersCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, containerTypes, socket) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
      $scope.systemId = system.id;
      $scope.systemName = system.name;
      $scope.containers = system.containerDefinitions;
      $scope.show = true;
    });
  });

  // scope build variables
  $scope.show_build = false;
  $scope.buildOutput = [];

  // Handle build output
  socket.on('stdout', function (out) {
    console.log(out);
    $scope.buildOutput.push({text:out, type:'out'});
  });
  socket.on('stderr', function (out) {
    console.log(out);
    $scope.buildOutput.push({text:out, type:'error'});
  });
  socket.on('result', function (out) {
    console.log(out);
    $scope.buildOutput.push({text:out, type:'result'});
  });

  $scope.resolveType = function(type){return containerTypes[type];}

  $scope.delete = function(systemId, container) {
    var r = confirm("Are you sure?");
    if (!r) {return;}
    api.del('/system/' + systemId + '/container/' + container.id, $scope.user, function(result){
      console.log('Container deleted');
      var index = $scope.containers.indexOf(container);
      $scope.containers.splice(index,1);
    });
  }

  // Deploy trigger
  $scope.deploy = function(systemId){
    console.log('Deploying system', systemId);

    $scope.show_build = true;

    $scope.buildOutput.splice(0,$scope.buildOutput.length);

    socket.emit('system/deploy', {accessToken: $scope.user.token, systemId: systemId}, function (data) {
      console.dir('deploy emitted');
      console.dir(data);
    });
  }

});