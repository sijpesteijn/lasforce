'use strict';

app.controller('animationPageCtrl', function($scope, $location) {
  //$scope.selectedAnimation; // = {id:1,name:'Kerst'};
  $scope.animationMouseOver = function(animationId) {
    $scope.selectedAnimationId = animationId;
  };

  $scope.animationMouseOut = function(animationId) {
    //if ($scope.selectedAnimationId === animationId) {
    $scope.selectedAnimationId = angular.undefined;
    //}
  };

  $scope.editAnimation = function(animationId) {
    $location.url('create_animation?animationId=' + animationId);
  }
});
