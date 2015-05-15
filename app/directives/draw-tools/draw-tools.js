'use strict';

app.controller('drawToolsCtrl', function($scope, colpick) {

  $scope.setTool = function(tool) {
    $scope.selectedTool = tool;
  };

  $scope.openColorPick = function(identifier) {
    colpick.openColorPick(identifier, 'white');

  }
});

app.directive('drawTools', function() {
  return {
    templateUrl: '/directives/draw-tools/draw-tools.html',
    controller: 'drawToolsCtrl',
    replace: true
  }
});
