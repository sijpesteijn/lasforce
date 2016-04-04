(function () {
  'use strict';

  app.controller('laserStatusCtrl', laserStatusCtrl).directive('laserStatus', laserStatusDirective);

  laserStatusCtrl.$inject = ['$interval','laser'];

  function laserStatusCtrl($interval, laser) {
    var delay = 1000, cntrl = this, checked = 0;
    cntrl.laser = laser;

    function connect_status() {
      if(!cntrl.laser.isLaserConnected()) {
        cntrl.laser.connectLaser();
        $interval(function() {
            connect_status();
          }, ++checked * 1000);
      } else {
        checked = 0;
      }
    }

    connect_status();
  }

  function laserStatusDirective() {
    return {
      templateUrl: '/directives/laser-status/laser-status.html',
      controller: 'laserStatusCtrl',
      controllerAs:'cntrl',
      replace: true,
      restrict: 'E'
    }
  }
})();
