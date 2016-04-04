(function () {
  'use strict';

  app.controller('animationPageCtrl', animationPageController);

  animationPageController.$inject = ['$scope', '$location', '$resource', 'settings', 'paperWrapper', 'animationPlayer','laser'];

  function animationPageController($scope, $location, $resource, settings, paperWrapper, animationPlayer, laser) {
    $scope.zoom = 0.01;
    $scope.animationPlayer = animationPlayer;
    $scope.livePreview = false;

    $scope.animationMouseOver = function (id) {
      $scope.current_animation_id = id;
      if (paperWrapper.isInitialized()) {
        $scope.animation = angular.undefined;
        animationPlayer.stop();
        paperWrapper.clearProject();
        laser.playAnimation(id,-1);
        $resource(settings.get('rest.templ.animation-list')).get({id: id}, {},
          function (data) {
            paperWrapper.loadAnimation(data);
            paperWrapper.showLayer(0);
            $scope.current_frame_id = 0;
            paperWrapper.updateView();
            animationPlayer.init(data);
            animationPlayer.play();
          },
          function (error) {
            throw {
              errorCode: 'AL002',
              name: 'LasForceError',
              error: error
            }

          });
      }
    };

    $scope.animationMouseOut = function (id) {
      $scope.current_animation_id = angular.undefined;
      $scope.animation = angular.undefined;
      laser.blank();
      animationPlayer.stop();
      paperWrapper.clearProject();
    };

    $scope.editAnimation = function (id) {
      animationPlayer.stop();
      $location.path('edit_animation/' + id);
    }
  }
})();
