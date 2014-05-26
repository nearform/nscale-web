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
  'topologyDirectives',
  'angular-momentjs'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/reset', {
        templateUrl: 'partials/reset',
        controller: 'ResetCtrl'
      })
      .when('/confirm', {
        templateUrl: 'partials/confirm',
        controller: 'ConfirmCtrl'
      })
      .when('/home', {
        templateUrl: 'partials/home',
        controller: 'HomeCtrl'
      })
      .when('/system/add', {
        templateUrl: 'partials/system/add',
        controller: 'HomeCtrl'
      })
      .when('/system/:systemId/edit', {
        templateUrl: 'partials/system/edit',
        controller: 'SystemCtrl'
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