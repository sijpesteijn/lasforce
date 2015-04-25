'use strict';

app.controller('infoCtrl', function($scope) {

  $scope.message;

  if (!('WebSocket' in window)) {
    alert('WebSocket not supported in your browser !');
  }

  //var socket = new WebSocket("ws://localhost:7070/laser/ws/message");
  //socket.onopen = function() {
  //  $scope.message = "Connected."
  //};
  //
  //socket.onerror = function(error) {
  //  $scope.message = error.type;
  //}
  //
  //socket.onmessage = function(event) {
  //  console.log(event.data);
  //  $scope.message = event.data;
  //}
});

app.directive('info', function() {
  return {
    templateUrl: '/directives/info/info.html',
    controller: 'infoCtrl',
    restrict: 'E'
  };

});
