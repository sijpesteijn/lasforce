'use strict';

app.controller('navigationCtrl', function($rootScope, $scope, $resource, settings, lasforceSettings, $location) {

  $scope.isSelected = function(page) {
    var currentRoute = $location.path().substring(1) || 'shows';
    return page === currentRoute;
  }

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
