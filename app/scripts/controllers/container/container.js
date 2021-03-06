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

angular.module('nfdWebApp').controller('ContainerCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, containerTypes, socket) {

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
      $scope.systemId = system.id;
      $scope.systemName = system.name;

      $scope.container = {};
      if ($routeParams.containerId) {
        $scope.containerId = $routeParams.containerId;

        var containers = system.containerDefinitions;
        for (var i = 0; i < containers.length; i++) {
          var container = containers[i];
          if (container.id === $scope.containerId) {
              $scope.container = container;
              break;
          }
        }
      }

      $scope.show = true;

    });
  });

  // scope build variables
  $scope.show_build = false;
  $scope.buildOutput = [];
  $scope.progress = 0;

  var initSocketDone = false;

  var scrollBuildOutputDown = function() {
    // wait 500ms before scrolling down
    setTimeout(function(){
      var elem = document.getElementById('container-build-output');
      elem.scrollTop = elem.scrollHeight;
    }, 500);
  };

  var initSocket = function() {
    if (initSocketDone) {return;}
    initSocketDone = true;

    // Handle build output
    socket.on('stdout', function (out) {
        var outJson = JSON.parse(out);
        console.log(outJson);

        // if (outJson.level !== 'debug' && outJson.level !== 'progress') {
        //   console.log(outJson);
        //   $scope.buildOutput.push({text:outJson.stdout, type:outJson.level});
        //   scrollBuildOutputDown();
        // }

        if (outJson.level === 'progress') {
          $scope.buildOutput.push({text:outJson.message, type:outJson.level});
          $scope.progress = Math.ceil(Math.min(outJson.stdout, 100));
        }

    });
    socket.on('stderr', function (out) {
        var outJson = JSON.parse(out);
        console.log(outJson);
        // $scope.buildOutput.push({text:outJson.stderr, type:'error'});
        // scrollBuildOutputDown();
    });
    socket.on('result', function (out) {
        console.log(out);
        $scope.buildOutput.push({text:out, type:'result'});
        scrollBuildOutputDown();
    });
  };

  var setRepositoryToken = function() {
    // TODO Get repository token if user does not have the credentials
    var user = $scope.user;
    if (user.service && user.service.github && user.service.github.credentials) {
        if (!$scope.container.specific) {
            $scope.container.specific = {};
        }
        $scope.container.specific.repositoryToken = user.service.github.credentials.token;
    }
  };

  // Build trigger
  $scope.build = function(){
      console.log('Building container');

      initSocket();
      $scope.show_build = true;

      $scope.buildOutput.splice(0,$scope.buildOutput.length);

      socket.emit('build', {accessToken: $scope.user.token, systemId:$scope.systemId, containerId:$scope.containerId}, function (data) {
          console.dir('build emitted');
          console.dir(data);
      });
  }

  // Deploy trigger
  /*
  $scope.deploy = function(){
      console.log('Deploying container');

      $scope.show_build = true;

      $scope.buildOutput.splice(0,$scope.buildOutput.length);

      socket.emit('deploy', {accessToken: $scope.user.token, systemId:$scope.systemId, containerId:$scope.containerId}, function (data) {
          console.dir('deploy emitted');
          console.dir(data);
      });
  }
  */

  $scope.resolveType = function(type){return containerTypes[type];}

  // Save container
  $scope.save = function() {

    $scope.saveClicked = true;
    if ($scope.form.$invalid) {return;}

    // TODO Only save specific properties that are associated with container type

    setRepositoryToken();

    api.post('/system/' + $scope.systemId + '/container', $scope.container, $scope.user, function(result){
        $scope.msg = 'Container saved';
        $location.path('/system/' + $scope.systemId);
    });
  }

  // Update container
  $scope.update = function() {

    $scope.updateClicked = true;
    if ($scope.form.$invalid) {return;}

    // TODO Only save specific properties that are associated with container type

    setRepositoryToken();
    api.put('/system/' + $scope.systemId + '/container/' + $scope.container.id, $scope.container, $scope.user, function(result){
        $scope.msg = 'Container updated';
        $location.path('/system/' + $scope.systemId);
    });
  }

});