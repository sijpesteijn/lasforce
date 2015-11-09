'use strict';

app.controller('animationCanvasCtrl', function ($scope, paperWrapper) {

    $scope.init = function () {
        paperWrapper.setup('animationCanvas');
        paperWrapper.setZoom($scope.zoom);
    };

    $scope.zoomIn = function() {
        $scope.zoom += 0.001; // Math.round(($scope.zoom + 0.01) * 10) / 10;
        paperWrapper.setZoom($scope.zoom);
    };

    $scope.zoomOut = function() {
        if ($scope.zoom > 0.001) {
            $scope.zoom -= 0.001; //Math.round(($scope.zoom - 0.1) * 10) / 10;
            paperWrapper.setZoom($scope.zoom);
        }
    };

    $scope.init();
});

app.directive('animationCanvas', function () {
    return {
        templateUrl: 'directives/animation-canvas/animation-canvas.html',
        controller: 'animationCanvasCtrl',
        replace: true,
        restrict: 'E',
        scope: {
            zoom: '='
        }
    }
});
