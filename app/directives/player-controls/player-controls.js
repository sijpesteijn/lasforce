'use strict';

app.controller('playerControlsCtrl', function ($scope, $interval, animationPlayer, laser) {
    $scope.loop = true;
    $scope.streaming = false;
    $scope.player = animationPlayer;
    $scope.laser = laser;

    $scope.toggleLoop = function () {
        $scope.loop = !$scope.loop;
        animationPlayer.setLoop($scope.loop);
    };

    $scope.toggleStreaming = function () {
        $scope.streaming = !$scope.streaming;
        laser.setStreaming($scope.streaming);
    };

    $scope.$watch('animation.metadata.framerate', function(newVal) {
        if (angular.isDefined(newVal) && animationPlayer.isPlaying()) {
            animationPlayer.stop();
            animationPlayer.play();
        }
    }, true);

    $scope.$watch('animation', function() {
        if (angular.isDefined($scope.animation)) {
            animationPlayer.init($scope.animation);
        }
    });

});

app.directive('playerControls', function () {
    return {
        templateUrl: 'directives/player-controls/player-controls.html',
        controller: 'playerControlsCtrl',
        replace: true,
        scope: {
            animation: '=',
            currentFrameId: '='
        }
    }
});
