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

angular.module('nfdWebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'constants',
  'apiService',
  'authService',
  'ctrlUtilService',
  'socketService',
  'pubsubService',
  'validatorService',
  'socketService',
  'ui.select2',
  'ui.tree',
  'ngchart'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/home', {
        templateUrl: 'partials/home',
        controller: 'HomeCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl'
      })
      .when('/forgot', {
        templateUrl: 'partials/auth/forgot',
        controller: 'ForgotCtrl'
      })
      .when('/reset', {
        templateUrl: 'partials/auth/reset',
        controller: 'ResetCtrl'
      })
      .when('/confirm', {
        templateUrl: 'partials/auth/confirm',
        controller: 'ConfirmCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl'
      })
      .when('/system/add', {
        templateUrl: 'partials/system/add',
        controller: 'HomeCtrl'
      })
      .when('/system/:systemId/edit', {
        templateUrl: 'partials/system/edit',
        controller: 'SystemCtrl'
      })
      .when('/system/:systemId/state', {
        templateUrl: 'partials/system/state',
        controller: 'StateCtrl'
      })
      .when('/system/:systemId/revisions', {
        templateUrl: 'partials/system/revisions',
        controller: 'RevisionsCtrl'
      })
      .when('/system/:systemId/currentstate', {
        templateUrl: 'partials/system/currentstate',
        controller: 'CurrentStateCtrl'
      })
      .when('/system/:systemId/targetstate', {
        templateUrl: 'partials/system/targetstate',
        controller: 'TargetStateCtrl'
      })
      .when('/system/:systemId/timeline', {
        templateUrl: 'partials/system/timeline',
        controller: 'TimelineCtrl'
      })
      .when('/system/:systemId/container/add', {
        templateUrl: 'partials/container/add',
        controller: 'ContainerCtrl'
      })
      .when('/system/:systemId/container/:containerId/edit', {
        templateUrl: 'partials/container/edit',
        controller: 'ContainerCtrl'
      })
      .when('/system/:systemId/container/:containerId', {
        templateUrl: 'partials/container/container',
        controller: 'ContainerCtrl'
      })
      .when('/system/:systemId', {
        templateUrl: 'partials/system/containers',
        controller: 'ContainersCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
