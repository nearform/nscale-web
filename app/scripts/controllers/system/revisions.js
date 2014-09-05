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

angular.module('nfdWebApp').controller('RevisionsCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, socket) {

  var loadRevisions = function(systemId) {
    api.get('/system/' + systemId + '/revisions', $scope.user, function(revisions) {
      $scope.revisions = revisions;

      // Hack to get system name
      api.get('/system/' + systemId + '/revision/' + revisions[0].id, $scope.user, function(revision) {
        $scope.systemName = revision.name;
        $scope.show = true;
      });

    });
  };

  // Init
  ctrlutil.init($scope, function(user) {
    $scope.systemId = $routeParams.systemId;
    loadRevisions($scope.systemId);
  });

  // scope build variables
  $scope.show_build = false;
  $scope.show_spinner = false;
  $scope.buildOutput = [];
  $scope.progress = 0;

  // Handle build output
  socket.on('stdout', function (out) {
      var outJson = JSON.parse(out);
      console.log(outJson);

      if (outJson.level !== 'debug' && outJson.level !== 'progress') {
        $scope.buildOutput.push({text:outJson.stdout, type:outJson.level});
      }
      else if (outJson.level === 'progress') {
        $scope.progress = Math.ceil(outJson.stdout);
      }
  });
  socket.on('stderr', function (out) {
      var outJson = JSON.parse(out);
      console.log(outJson);
      // TODO Hack, this error should not be coming from backend, remove once fixed!
      if (outJson.stderr.indexOf('Pseudo-terminal') !== 0 && outJson.stderr.indexOf('Usage: docker') !== 0) {
        $scope.buildOutput.push({text:outJson.stderr, type:'error'});
      }
  });
  socket.on('result', function (out) {
      $scope.show_spinner = false;
      $scope.progress = 100;
      console.log(out);
      $scope.buildOutput.push({text:out, type:'result'});
      loadSystem();
  });

  // Deploy trigger
  $scope.deploy = function(systemId, revisionId){
    console.log('Deploying system revision', systemId, revisionId);

    $scope.show_build = true;
    $scope.show_spinner = true;
    $scope.progress = 0;

    $scope.buildOutput.splice(0, $scope.buildOutput.length);

    socket.emit('system/deploy', {accessToken: $scope.user.token, systemId:systemId, revisionId:revisionId}, function (data) {
      console.log('deploy emitted');
      console.log(data);
    });
  }

});
