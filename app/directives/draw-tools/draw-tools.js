'use strict';

app.controller('drawToolsCtrl', function($scope) {

  function init() {
    $scope.color = 'FFFFFF';
  }

  $scope.setTool = function(tool) {
    $scope.selectedTool = tool;
  };

  init();
});

app.directive('drawTools', function() {
  return {
    templateUrl: '/directives/draw-tools/draw-tools.html',
    controller: 'drawToolsCtrl',
    replace: true
  }
});
