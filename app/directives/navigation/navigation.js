'use strict';

app.controller('navigationCtrl', function($rootScope, $scope, $resource, settings, lasforceSettings, $location, uploadIldaFactory) {

  $scope.isSelected = function(page) {
    var currentRoute = $location.path().substring(1) || 'shows';
    return page === currentRoute;
  };

  function init() {
    $resource(settings.get('rest.templ.ilda-settings')).get(
      function (data) {
        $rootScope.lasforceSettings = data;
      },
      function (error) {
          $rootScope.lasforceSettings = {
              framerate: 20,
              loopCount: 1,
              color: '#123123'
          };
        throw {
            errorCode: 'N001',
            name: 'LasForceError',
            error: error
        };
      });
  }

    $scope.uploadIlda = function() {
        uploadIldaFactory.openUploadFileModal();
    }

  $scope.settings = function() {
    lasforceSettings.openSettingsModal($rootScope.lasforceSettings).result.then(function(lasforceSettings) {
      $rootScope.lasforceSettings = lasforceSettings;
    });
  };

  init();
});

app.directive('navigation', function() {
  return {
    templateUrl: 'directives/navigation/navigation.html',
    controller: 'navigationCtrl',
    restrict: 'E'
  };

});
