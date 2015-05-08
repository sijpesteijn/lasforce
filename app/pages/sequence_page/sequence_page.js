'use strict';

app.controller('sequencePageCtrl', function($scope) {

  $scope.animationMouseOver = function(animationId) {
    $scope.selectedAnimationId = animationId;
  };

  $scope.animationMouseOut = function(animationId) {
    //if ($scope.selectedAnimationId === animationId) {
      $scope.selectedAnimationId = angular.undefined;
    //}
  };

});
