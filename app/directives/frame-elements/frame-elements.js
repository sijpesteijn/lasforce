'use strict';

app.controller('frameElementsCtrl', function ($scope, paperWrapper, animationPlayer) {
    $scope.treeOptions = {
        multiSelection: true
    };
    $scope.model = [];

    $scope.select = function ($event, node) {
        $event.stopPropagation();
        if (node.paperObjectMetaData.highlighted) {
            paperWrapper.selectPaperObject(node.paperObjectMetaData);
            node.paperObjectMetaData.highlighted = false;
        } else {
            paperWrapper.deselectPaperObject(node.paperObjectMetaData);
        }
    };

    $scope.highlightSelection = function ($event, node) {
        if (!node.paperObjectMetaData.selected) {
            paperWrapper.selectPaperObject(node.paperObjectMetaData);
            node.paperObjectMetaData.highlighted = true;
        }
    };

    $scope.clearSelection = function ($event, node) {
        if (node.paperObjectMetaData.highlighted) {
            paperWrapper.deselectPaperObject(node.paperObjectMetaData);
            node.paperObjectMetaData.highlighted = false;
        }
    };

    $scope.editNode = function ($event, node) {
        node.shape.edit = true;
        $event.stopPropagation();
    };

    $scope.saveNode = function ($event, node) {
        node.shape.edit = false;
        node.shape.name = node.name;
        $event.stopPropagation();
    };

    $scope.deleteNode = function ($event, node) {
        node.shape.remove();
        removeFromModel(node.$$hashKey, $scope.model);
        paper.view.draw();

    };

    function removeFromModel(key, elements) {
        for(var i = 0; i<elements.length;i++) {
            if (elements[i].$$hashKey === key) {
                elements.splice(i, 1);
                return true;
            }
            var removed = false;
            if (elements[i].children.length > 0) {
                removed = removeFromModel(key, elements[i].children);
            }
            if (removed)
                continue;
        }
    }

    function loadFrameElements(shapes) {
        $scope.model = [];
        var id = 0;
        angular.forEach(shapes, function (paperObjectMetaData) {
                paperObjectMetaData.selected = false;
                var node = {id: id, name: paperObjectMetaData.name, paperObjectMetaData: paperObjectMetaData};
                node.children = getChildren(node, paperObjectMetaData);
                id++;
                $scope.model.push(node);
        });
    }
    $scope.$watch(function() { return animationPlayer.getCurrentFrameId();}, function(currentFrameId) {
        if (angular.isDefined(currentFrameId) && angular.isDefined($scope.animation)) {
            loadFrameElements($scope.animation.frames[currentFrameId].shapes);
        }
    }, true);

    function getChildren(parent, paperObjectMetaData) {
        var children = [];
        var id = 0;
        if (paperObjectMetaData.segments) {
            angular.forEach(paperObjectMetaData.segments, function (segment) {
                segment.selected = false;
                segment.parent = parent;
                var child = {id: parent.id+ ',' + id++, name: segment.point.name, paperObjectMetaData: segment};
                child.children = getChildren(child, segment);
                children.push(child);
            });
        }
        return children;
    }

});

app.directive('frameElements', function () {
    return {
        templateUrl: 'directives/frame-elements/frame-elements.html',
        controller: 'frameElementsCtrl',
        replace: true,
        restrict: 'E',
        scope: {
            animation: '=',
            currentFrameId: '='
        }
    }
});
