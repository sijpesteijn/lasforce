'use strict';

app.controller('playerControlsCtrl', function($scope) {

  function init() {
  }

  init();
});

app.directive('playerControls', function() {
  return {
    templateUrl: '/directives/player-controls/player-controls.html',
    controller: 'playerControlsCtrl',
    replace: true
  }
});
