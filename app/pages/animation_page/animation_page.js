'use strict';

app.controller('animationPageCtrl', function($scope) {
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