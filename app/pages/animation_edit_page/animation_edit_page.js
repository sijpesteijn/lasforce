'use strict';

app.controller('animationEditPageCtrl', function($scope) {
  $scope.selectedTool;

  function init() {

  }

  $scope.animationMouseOver = function(animationId) {
    $scope.selectedAnimationId = animationId;
  };

  $scope.animationMouseOut = function(animationId) {
    $scope.selectedAnimationId = angular.undefined;
  };

  init();
});
