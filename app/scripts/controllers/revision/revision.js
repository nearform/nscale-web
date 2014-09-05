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

angular.module('nfdWebApp').controller('RevisionCtrl', function ($scope, $http, $location, $routeParams, ctrlutil, api, containerTypes, socket) {

  var getRevision = function(systemId, revisionId, callback) {

    // TODO Get /system/<systemId>/revision/<revisionId> doesn't return revision message or date, so have to do list :/
    api.get('/system/' + systemId + '/revisions', $scope.user, function(revisions) {

      // Find revision with revisionId
      for (var i = 0; i < revisions.length; i++) {
        if (revisionId === revisions[i].id) {
          return callback(revisions[i]);
        }
      }

      // not found
      callback(null);

    });

  }

  // Init
  ctrlutil.init($scope, function(user) {
    api.get('/system/' + $routeParams.systemId, user, function(system){
      $scope.systemId = system.id;
      $scope.systemName = system.name;

      getRevision($scope.systemId, $routeParams.revisionId, function(revision) {
        $scope.revision = revision;
        $scope.show = true;
      });

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

        if (outJson.level !== 'debug' && outJson.level !== 'progress') {
          console.log(outJson);
          $scope.buildOutput.push({text:outJson.stdout, type:outJson.level});
          scrollBuildOutputDown();
        }
        else if (outJson.level === 'progress') {
          $scope.progress = Math.ceil(Math.min(outJson.stdout, 100));
        }

    });
    socket.on('stderr', function (out) {
        var outJson = JSON.parse(out);
        console.log(outJson);
        $scope.buildOutput.push({text:outJson.stderr, type:'error'});
        scrollBuildOutputDown();
    });
    socket.on('result', function (out) {
        console.log(out);
        $scope.buildOutput.push({text:out, type:'result'});
        scrollBuildOutputDown();
    });
  };

  // Deploy trigger
  $scope.deploy = function() {
    var systemId = $scope.systemId;
    var revisionId = $scope.revision.id;
    console.log('Deploying system revision', systemId, revisionId);

    initSocket();

    $scope.show_preview = false;
    $scope.show_build = true;
    $scope.progress = 0;

    $scope.buildOutput.splice(0, $scope.buildOutput.length);

    socket.emit('system/deploy', {accessToken: $scope.user.token, systemId:systemId, revisionId:revisionId}, function (data) {
      console.dir('deploy emitted');
      console.dir(data);
    });
  }

  $scope.preview = function() {
    var systemId = $scope.systemId;
    var revisionId = $scope.revision.id;
    console.log('Preview system revision', systemId, revisionId);

    $scope.show_build = false;

    api.get('/system/' + systemId + '/revision/' + revisionId + '/preview', $scope.user, function(previewOutput) {
      $scope.previewOutput = previewOutput;
      $scope.show_preview = true;
    });

  }

});