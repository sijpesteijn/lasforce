'use strict';

app.controller('animationEditPageCtrl', function ($scope, $routeParams, toolFactory, paperWrapper, animationService, animationPlayer) {
    $scope.current_tool;
    $scope.current_tool_name = 'line';
    $scope.current_color = '#0a26fa';
    $scope.zoom = 0.01;
    var animation_id = undefined;

    function init() {
        animation_id = $routeParams.animation_id;
    }

    function initAnimation() {
        paperWrapper.loadAnimation($scope.animation);
        paperWrapper.showLayer(0);
        createTool();
        paperWrapper.updateView();
    }

    $scope.$watch(function() { return paperWrapper.isInitialized(); }, function(initialized) {
        if (initialized) {
            if (animation_id !== undefined) {
                animationService.getLasforceAnimation(animation_id).then(function(animation) {
                    $scope.animation = animation;
                    initAnimation();
                });
            } else {
                $scope.animation = {
                    metadata: {
                        id: 0,
                        name: 'Animation_0',
                        framerate: 1
                    },
                    frames: [
                        {
                            name: 'Frame_0',
                            id: 0,
                            shapes: []
                        }]
                };
                initAnimation()
            }
        }
    });

    var createTool = function() {
        $scope.current_tool = toolFactory.getTool($scope.current_tool_name);
        $scope.current_tool.init(objectListener, $scope.current_color);
    };

    var objectListener = function(shape) {
        shape.checked = false;
        $scope.animation.frames[0].shapes.push(shape);
        $scope.$digest();
    };

    $scope.$watch('current_tool_name', function (tool_name) {
        if (angular.isDefined(tool_name)) {
            if ($scope.current_tool) {
                $scope.current_tool.onDestroy();
            }
            $scope.current_tool_name = tool_name;
            if (paperWrapper.isInitialized()) {
                createTool();
            }
        }
    },true);

    $scope.$watch('current_color', function (color) {
        if (angular.isDefined(color) && $scope.current_tool) {
            $scope.current_tool.onColorChange(color);
        }
    },true);

    $scope.$watch(function() { return animationPlayer.getCurrentFrameId();}, function (newValue, oldValue) {
        if (paperWrapper.isInitialized() && newValue != undefined && oldValue != undefined) {
            paperWrapper.hideLayer(oldValue);
            paperWrapper.showLayer(newValue);
        }
    }, true);

        $scope.getElements = function() {
        if ($scope.animation.frames.length > 0 && $scope.animation.frames.shapes.length > 0)
            return;
        return $scope.animation.frames[$scope.current_frame_id].shapes;
    };

    $scope.$watch('lasforceSettings', function (lasforceSettings) {
        if (angular.isDefined(lasforceSettings)) {
            $scope.selectedColor = '#' + lasforceSettings.default_color;
        }
    }, true);

    $scope.animationMouseOver = function (animationId) {
        $scope.selectedAnimationId = animationId;
    };

    $scope.animationMouseOut = function (animationId) {
        $scope.selectedAnimationId = angular.undefined;
    };

    init();
});
