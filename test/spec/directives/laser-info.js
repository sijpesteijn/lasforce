'use strict';

describe('Controller: LaserInfoCtrl', function () {

  var status = {'on': true};

  beforeEach(function () {
    module('lasforceApp');
  });

  var laserStatusCtrl, $intervalSpy;

  // Initialize the controller and a mock scope
  beforeEach(angular.mock.inject(function ($controller, $rootScope, $interval, laserStatusService) {
    this.scope = $rootScope.$new();
    $intervalSpy = jasmine.createSpy('$interval', $interval);
    this.laserStatusService = laserStatusService;

    laserStatusCtrl = $controller('laserStatusCtrl', {
      $scope: this.scope,
      $interval: $intervalSpy,
      laserStatusService: laserStatusService
    });
  }));

  describe('get the laser status', function () {
    it('should tell that the laser is on', function () {
      this.scope.laserStatus = { 'on': true };
      spyOn(this.laserStatusService, 'get').and.returnValue(this.scope.laserStatus);

      this.scope.getLaserStatus();

      expect($intervalSpy).toHaveBeenCalledWith(this.scope.getLaserStatus, 1000);
      expect(this.scope.isOn()).toBeTruthy();
    });

    it('should tell that the laser is off', function () {
      this.scope.laserStatus = { 'on': false};
      spyOn(this.laserStatusService, 'get').and.returnValue(this.scope.laserStatus);

      this.scope.getLaserStatus();

      expect($intervalSpy).toHaveBeenCalledWith(this.scope.getLaserStatus, 1000);
      expect(this.scope.isOn()).toBeFalsy();
    });
  });

  describe('change the laser status', function() {
    it('should turn the laser off', function() {
      this.scope.laserStatus = {'on' : false };
      spyOn(this.laserStatusService,'post').and.returnValue(this.scope.laserStatus);
      this.scope.saveLaserStatus();
      expect(this.scope.isOn()).toBeFalsy();
    });
  });
});
