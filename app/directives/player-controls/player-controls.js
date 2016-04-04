(function () {

  'use strict';

  app.controller('playerControlsCtrl', playerControlsController).directive('playerControls', playerControlsDirective);

  playerControlsController.$inject = ['$scope', '$interval', 'animationPlayer', 'laser'];

  function playerControlsController($scope, $interval, animationPlayer, laser) {
    $scope.loop = true;
    $scope.livePreview = false;
    $scope.player = animationPlayer;
    $scope.laser = laser;

    $scope.toggleLoop = function () {
      $scope.loop = !$scope.loop;
      animationPlayer.setLoop($scope.loop);
    };

    $scope.$watch('livePreview',function () {
      if (!$scope.livePreview) {
        laser.blank();
      } else {
        laser.playAnimationFrame($scope.animation.id, animationPlayer.getCurrentFrameId(), -1);
      }
    }, true);

    $scope.$watch('animation.metadata.framerate', function (newVal) {
      if (angular.isDefined(newVal) && animationPlayer.isPlaying()) {
        animationPlayer.stop();
        animationPlayer.play();
      }
    }, true);

    $scope.$watch('animation', function () {
      if (angular.isDefined($scope.animation)) {
        animationPlayer.init($scope.animation);
      }
    });

    $scope.$watch(function () {
      return animationPlayer.getCurrentFrameId();
    }, function (currentFrameId) {
      if ($scope.streaming && angular.isDefined(currentFrameId) && angular.isDefined($scope.animation)) {
        console.log('CURRENT ID: ' + animationPlayer.getCurrentFrameId());
        laser.playAnimationFrame($scope.animation, currentFrameId);
      }
    }, true);

    $scope.$watch(function () {
      return animationPlayer.isPlaying();
    }, function (playing) {
      if ($scope.streaming && !playing) {
        laser.blank();
      }
    }, true);
  }

  function playerControlsDirective() {
    return {
      templateUrl: 'directives/player-controls/player-controls.html',
      controller: 'playerControlsCtrl',
      replace: true,
      scope: {
        animation: '=',
        currentFrameId: '='
      }
    }
  }

})();

