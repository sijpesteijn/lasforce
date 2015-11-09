'use strict';

app.controller('animationFramesCtrl', function($scope, paperWrapper, animationPlayer) {
    $scope.player = animationPlayer;
    $scope.new_frame_copy_children = true;
    $scope.frames = undefined;

    $scope.addFrame = function () {
        animationPlayer.addFrame($scope.new_frame_copy_children);
    };

    $scope.removeFrame = function (id) {
        animationPlayer.removeFrame(id);
    };

    $scope.setCurrentFrame = function(id) {
        animationPlayer.showFrame(id);
    };

    $scope.$watch(function() { return animationPlayer.getCurrentFrameId();}, function (currentFrameId) {
        if (angular.isDefined(currentFrameId) && angular.isDefined($scope.animation)) {
            $scope.frames = $scope.animation.frames;
        }
    }, true);
});

app.directive('animationFrames', function() {
  return {
    templateUrl: 'directives/animation-frames/animation-frames.html',
    replace: true,
      restrict: 'E',
      controller: 'animationFramesCtrl',
      scope: {
          animation: '='
      }
  }
});
