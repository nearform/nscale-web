'use strict';

(function(){

	var socket_module = angular.module('socketService', ['btford.socket-io']);

	socket_module.factory('socket', function ($rootScope) {
    //var socket = io.connect('http://localhost:3000');
    //var socket = io.connect('http://ec2-54-216-145-36.eu-west-1.compute.amazonaws.com:3000');
    var socket = io.connect('http://nfd.nearform.com:3000');
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
