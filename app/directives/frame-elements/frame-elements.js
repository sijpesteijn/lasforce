'use strict';

app.controller('frameElementsCtrl', function ($scope, paperWrapper, animationPlayer) {
  $scope.treeOptions = {
    multiSelection: true
  };
  $scope.model = [];

  $scope.select = function ($event, node) {
    $event.stopPropagation();
    if (node.highlighted) {
      paperWrapper.selectPaperObject(node.path?node.path:node.point);
      node.highlighted = false;
    } else {
      paperWrapper.deselectPaperObject(node.path?node.path:node.point);
    }
  };

  $scope.highlightSelection = function ($event, node) {
    if (!node.selected) {
      paperWrapper.selectPaperObject(node.path?node.path:node.point);
      node.highlighted = true;
    }
  };

  $scope.clearSelection = function ($event, node) {
    if (node.highlighted) {
      paperWrapper.deselectPaperObject(node.path?node.path:node.point);
      node.highlighted = false;
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
    for (var i = 0; i < elements.length; i++) {
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

  function loadFrameSegments(segments) {
    $scope.model = [];
    var id = 0;
    angular.forEach(segments, function (segment) {
      segment.selected = false;
      var node = {id: id, name: 'path', highlighted: false, selected: false, path : segment.paper.path};
      node.children = getPoints(node, segment.paper.points);
      id++;
      $scope.model.push(node);
    });
  }

  function getPoints(parent, points) {
    var children = [];
    var id = 0;
    for (var i = 0; i< points.length;i++) {
        var point = points[i];
        point.selected = false;
        point.parent = parent;
        var child = {id: id++, name: 'point_' + id, highlighted: false, selected: false, point: point};
        children.push(child);
    }
    return children;
  }

  $scope.$watch(function () {
    return animationPlayer.getCurrentFrameId();
  }, function (currentFrameId) {
    if (angular.isDefined(currentFrameId) && angular.isDefined($scope.animation)) {
      loadFrameSegments($scope.animation.frames[currentFrameId].segments);
    }
  }, true);

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
