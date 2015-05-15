'use strict';

app.controller('navigationCtrl', function($rootScope, $scope, $resource, settings, lasforceSettings) {

  function init() {
    $resource(settings.get('rest.templ.ilda-settings')).get(
      function (data) {
        $rootScope.lasforceSettings = data;
      },
      function () {

      });
  }

  $scope.settings = function() {
    lasforceSettings.openSettingsModal($rootScope.lasforceSettings).result.then(function(lasforceSettings) {
      $rootScope.lasforceSettings = lasforceSettings;
    });
  }

  init();
});

app.directive('navigation', function() {
  return {
    templateUrl: '/directives/navigation/navigation.html',
    controller: 'navigationCtrl',
    restrict: 'E'
  };

});
