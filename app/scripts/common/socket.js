'use strict';

(function(){

  var apiserver = nfd.context.apiserver;

	var socket_module = angular.module('socketService', ['btford.socket-io']);

	socket_module.factory('socket', function ($rootScope) {
    var socket = io.connect(apiserver);
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });

})();
