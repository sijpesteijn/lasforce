'use strict';

app.controller('lasforceSettingsCtrl', function ($scope, $resource, settings, lasforceSettings, $modalInstance) {
  var framerate, loopCount;
  $scope.lasforceSettings = lasforceSettings;

  function init() {
    framerate = $('#framerate').spinner();
    loopCount = $('#loopCount').spinner();
  }

  $scope.toggleInfinitive = function () {
    if ($scope.loopCount == -1) {
      $scope.loopCount = 1;
      loopCount.spinner('enable');
    } else {
      $scope.loopCount = -1;
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

  function init() {
  }

  var openSettingsModal = function (lasforceSettings) {
    return $modal.open({
      templateUrl: '/modals/settings/settings.html',
      controller: 'lasforceSettingsCtrl',
      resolve: {
        lasforceSettings : function() {
          return lasforceSettings;
        }
      }
    });
  }

  init();

  return {
    openSettingsModal: function (lasforceSettings) {
      return openSettingsModal(lasforceSettings);
    }
  };

});
