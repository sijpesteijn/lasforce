'use strict';

app.controller('drawToolsCtrl', function ($scope, history, toolFactory) {
    $scope.history = history;
    $scope.tools = toolFactory.getTools();

    $scope.setTool = function(tool_name) {
        $scope.current_tool_name = tool_name;
    }
});

app.directive('drawTools', function () {
    return {
        templateUrl: 'directives/draw-tools/draw-tools.html',
        controller: 'drawToolsCtrl',
        replace: true
    }
});
