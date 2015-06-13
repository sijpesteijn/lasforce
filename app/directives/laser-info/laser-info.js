'use strict';

app.controller('laserInfoCtrl', function($scope, $interval, $resource, settings) {

  function getLaserInfo() {
    $resource(settings.get('rest.templ.laser')).get(
      null,
      function (data) {
        $scope.laserInfo = data;
      },
      function(error, status) {
        throwError('L001', error, status);
      });
  }

  function init() {
    getLaserInfo();
    $interval(function() {
      getLaserInfo();
    }, 1000);
  }

  $scope.isOn = function() {
    return true;
  };

  init();
});

app.directive('laserInfo', function() {
  return {
    templateUrl: '/directives/laser-info/laser-info.html',
    controller: 'laserInfoCtrl',
    replace: true,
    restrict: 'E'
  }
});
