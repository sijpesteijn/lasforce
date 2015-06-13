'use strict';

app.controller('playerControlsCtrl', function($scope) {

  function init() {
    if (angular.isUndefined($scope.zoom)) {
      $scope.zoom = 1;
    }
  }

  $scope.getZoom = function() {
    return Math.round($scope.zoom * 100);
  };

  init();
});

app.directive('playerControls', function() {
  return {
    templateUrl: '/directives/player-controls/player-controls.html',
    controller: 'playerControlsCtrl',
    replace: true
  }
});
