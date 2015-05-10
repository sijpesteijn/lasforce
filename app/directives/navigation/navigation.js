'use strict';

app.controller('navigationCtrl', function($scope, lasforceSettings) {

  $scope.settings = function() {
    lasforceSettings.openSettingsModal();
  }
});

app.directive('navigation', function() {
  return {
    templateUrl: '/directives/navigation/navigation.html',
    controller: 'navigationCtrl',
    restrict: 'E'
  };

});
