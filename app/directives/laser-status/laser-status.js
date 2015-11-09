'use strict';

app.controller('laserStatusCtrl', ['$scope' ,'$interval', 'laserStatusService' ,function($scope, $interval, laserStatusService) {
  $scope.laserStatus;

  $scope.getLaserStatus = function() {
    $scope.laserStatus = laserStatusService.get();
  };

  $scope.saveLaserStatus = function() {
    $scope.laserStatus = laserStatusService.post($scope.laserStatus);
  };

  function init() {
    $interval($scope.getLaserStatus, 1000);
  }

  $scope.isOn = function() {
    return $scope.laserStatus.on;
  };

  init();
}]);

app.directive('laserStatus', function() {
  return {
    templateUrl: '/directives/laser-status/laser-status.html',
    controller: 'laserStatusCtrl',
    replace: true,
    restrict: 'E'
  }
});
