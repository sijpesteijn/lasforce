'use strict';

describe("service: laser", function() {

  var laserService, settingsMock;

  beforeEach(function() {
    module(function($provide){
      $provide.service('settings', function(){
        this.url = jasmine.createSpy('get').andCallFake(function(key) {
          return 'bla';
        });
      });
    });
    module('lasforceApp');
  });

  beforeEach(inject(function (laserInfoService, $resource, settings) {
    laserService = laserStatusService;
    settingsMock = settings;
    //spyOn(settingsMock, 'get').and.returnValue('bla');
  }));

  xdescribe('bla', function() {
    it('should bla', function() {
      var status = laserService.get();
      expect(settingsMock.get).toHaveBeenCalledWith('rest.templ.laser');
      expect(status.on).toEqual(true);
    })
  })
});
