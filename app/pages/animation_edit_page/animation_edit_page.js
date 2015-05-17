'use strict';

app.controller('animationEditPageCtrl', function($scope) {
  $scope.selectedTool;
  $scope.selectedColor = '#CECECE';

  function init() {
  }

  $scope.$watch('lasforceSettings', function(lasforceSettings) {
    if (angular.isDefined(lasforceSettings)) {
      $scope.selectedColor ='#' + lasforceSettings.default_color;
    }
  }, true);

  //$scope.$watch('selectedColor', function(selectedColor) {
  //  console.log('SELECTED COLOR: ' + selectedColor);
  //  $scope.selectedColor = selectedColor;
  //},true);

    $scope.animationMouseOver = function(animationId) {
    $scope.selectedAnimationId = animationId;
  };

  $scope.animationMouseOut = function(animationId) {
    $scope.selectedAnimationId = angular.undefined;
  };

  init();
});
