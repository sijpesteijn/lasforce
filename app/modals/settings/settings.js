'use strict';

app.controller('lasforceSettingsCtrl', function ($scope, $resource, settings, $modalInstance) {
  var framerate, loopCount;

  function init() {
    $resource(settings.get('rest.templ.ilda-settings')).get(
      function (data) {
        $scope.settings = data;
        //$scope.colorValue = $scope.settings.default_color;
      },
      function () {

      });

    framerate = $('#framerate').spinner();
    loopCount = $('#loopCount').spinner();
  }

  $scope.$watch('settings', function(newValue) {
    //$scope.settings.default_color = $scope.colorValue;
    console.log('Bla');
  }, true);

  $scope.toggleInfinitive = function () {
    if ($scope.loopCount == -1) {
      $scope.loopCount = 1;
      loopCount.spinner('enable');
    } else {
      $scope.loopCount = -1;
      loopCount.spinner('disable');
    }
  }


  $scope.cancel = function () {
    $modalInstance.close();
  };

  $scope.save = function () {
    $resource(settings.get('rest.templ.ilda-settings')).save(
      {settings: $scope.settings},
      function (data) {
        $modalInstance.close();
      },
      function () {

      });
  };

  init();
});

app.factory('lasforceSettings', function ($modal) {
  var openSettingsModal = function () {
    return $modal.open({
      templateUrl: '/modals/settings/settings.html',
      controller: 'lasforceSettingsCtrl'
    });
  }

  return {
    openSettingsModal: function () {
      return openSettingsModal();
    }
  };

});
