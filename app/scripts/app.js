'use strict';

angular.module('nfdWebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'constants',
  'apiService',
  'authService',
  'socketService',
  'pubsubService',
  'validatorService'
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
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });