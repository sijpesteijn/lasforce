'use strict';

app.controller('animationEditPageCtrl', function($scope) {
  $scope.selectedTool;
  //$scope.selectedAnimation; // = {id:1,name:'Kerst'};
  $scope.animationMouseOver = function(animationId) {
    $scope.selectedAnimationId = animationId;
  };

  $scope.animationMouseOut = function(animationId) {
    //if ($scope.selectedAnimationId === animationId) {
    $scope.selectedAnimationId = angular.undefined;
    //}
  };

});
