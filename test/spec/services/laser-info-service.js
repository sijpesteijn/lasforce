describe("service: laser", function() {
  var uri = 'http://localhost:7070/laser/rest/laser';

  var i18nextOptions = {
    lng: 'de-DE',
    useCookie: false,
    useLocalStorage: false,
    fallbackLng: 'dev',
    resStore: {
      'de-DE': {
        translation: {
          'hello': 'Herzlich Willkommen!',
          'helloName': 'Herzlich Willkommen, __name__!',
          'helloNesting': 'Weißt du was? Du bist $t(hello)',
          'woman': 'Frau',
          'woman_plural': 'Frauen',
          'woman_plural_0': 'Keine Frauen',
          'friend': 'Freund',
          'friend_male': 'Fester Freund',
          'friend_female': 'Feste Freundin',

          'helloHTML': '<h1>Herzlich Willkommen!</h1>',
          'helloNameHTML': '<h1>Herzlich Willkommen, __name__!</h1>'
        }
      },
      'dev': {
        translation: {
          'hello': 'Welcome!',
          'helloName': 'Welcome, __name__!',
          'helloNesting': 'You know what? You\'re $t(hello)',
          'woman': 'Woman',
          'woman_plural': 'Women',
          'woman_plural_0': 'No women',
          'friend': 'Friend',
          'friend_male': 'Boyfriend',
          'friend_female': 'Girlfriend',

          'helloHTML': '<h1>Welcome!</h1>',
          'helloNameHTML': '<h1>Welcome, __name__!</h1>'
        }
      }
    }
    //resGetPath: '/test/locales/__lng__/__ns__.json'
  };


  beforeEach(function() {
    module("lasforceApp");
    module('jm.i18next', function ($i18nextProvider) {
      $i18nextProvider.options = i18nextOptions;
    });
  });

  beforeEach(angular.mock.inject(function($httpBackend) {
    this.$httpBackend = $httpBackend;
  }));

  xdescribe("laser failure", function() {
    it("should be shown when there is a communication error.", inject(function(laserInfoService) {
      this.$httpBackend.expectGET(uri).respond(500);
      expect(status.on).toEqual(undefined);
    }));
  });

  xdescribe("laser state", function() {
    it("should be 'ON'", inject(function(laserInfoService) {
      var laserInfo = {'on':true};
      this.$httpBackend.expectGET(uri).respond(laserStatus);
      var status = laserStatusService.get();
      this.$httpBackend.flush();
      expect(status.on).toEqual(true);
    }));

    it("should be 'OFF'", inject(function(laserInfoService) {
      var laserInfo = {'on':false};
      this.$httpBackend.expectGET(uri).respond(laserStatus);
      var status = laserStatusService.get();
      this.$httpBackend.flush();
      expect(status.on).toEqual(false);
    }));
  });

 xdescribe("laser toggle", function() {
    it("should turn the laser 'ON'", inject(function(laserInfoService) {
      var laserInfo = {'on': true};
      this.$httpBackend.whenPOST(uri, laserStatus).respond(laserStatus);
      var status = laserStatusService.save(laserStatus);
      this.$httpBackend.flush();
      expect(status.on).toEqual(true);
    }));
    it("should turn the laser 'OFF'", inject(function(laserInfoService) {
      var laserInfo = {'on': false};
      this.$httpBackend.whenPOST(uri, laserStatus).respond(laserStatus);
      var status = laserStatusService.save(laserStatus);
      this.$httpBackend.flush();
      expect(status.on).toEqual(false);
    }));
  });
});
