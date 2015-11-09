'use strict';

app.controller('lasforceSettingsCtrl', function ($scope, $resource, settings, applicationSettings, $modalInstance) {
  var framerate, loopCount;
  $scope.applicationSettings = applicationSettings;

  function init() {
    framerate = $('#framerate').spinner({
        min: 1,
        max: 50,
        step: 1
    });
    loopCount = $('#loopCount').spinner();
  }

  $scope.toggleInfinitive = function () {
    if ($scope.loopCount == -1) {
      $scope.loopCount = 1;
        loopCount.spinner('value', 1);
      loopCount.spinner('enable');
    } else {
      $scope.loopCount = -1;
        loopCount.spinner('value', -1);
      loopCount.spinner('disable');
    }
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };

  $scope.save = function () {
    $resource(settings.get('rest.templ.ilda-settings')).save(
      {settings: $scope.lasforceSettings},
      function (data) {
        $modalInstance.close({lasforceSettings: $scope.lasforceSettings});
      },
      function () {

      });
  };

  init();
});

app.factory('lasforceSettings', function ($modal) {

  var openSettingsModal = function (applicationSettings) {
    return $modal.open({
      templateUrl: 'modals/lasforce-settings/lasforce-settings.html',
      controller: 'lasforceSettingsCtrl',
      resolve: {
        applicationSettings : function() {
          return applicationSettings;
        }
      }
    });
  };

  return {
    openSettingsModal: function (applicationSettings) {
      return openSettingsModal(applicationSettings);
    }
  };

});
