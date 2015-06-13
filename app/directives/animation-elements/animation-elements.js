'use strict';

app.controller('animationElementsCtrl', function($scope) {
  $scope.treeOptions = {
    multiSelection: true
  }
  $scope.animationElements = [];
  $scope.selected = [];
  var index = 0;

  function getChildren(element) {
    var children = [];
    if (element.segments) {
      angular.forEach(element.segments, function(segment) {
        var child = {id:index++, label:segment.name, segment: segment};
        children.push(child);
      });
    }
    return children;
  }


  $scope.select = function(branch, selected) {
    if(selected) {
      $scope.selected.push(branch);

    } else {
      var index = $scope.selected.indexOf(branch);
      if (index > -1)
        $scope.selected.splice(index,1);
    }
    //if (branch.selected) {
    //  if (branch.label.indexOf('Path') > 0) {
    //    branch.segment.fullySelected = false;
    //  } else {
    //    branch.segment.setSelected(false);
    //  }
    //  branch.selected = false;
    //} else {
    //  branch.selected = true;
    //  if (branch.label.indexOf('Path') > 0) {
    //    branch.segment.fullySelected = true;
    //  } else {
    //    branch.segment.setSelected(true);
    //  }
    //}
    //paper.view.update();
  };

  $scope.showNewElements = function() {
    $scope.animationElements = [];
    var elements = $scope.getLayerElements();
    angular.forEach(elements, function(element) {
      var elem = {label:element.name, segment: element};
      elem.children = getChildren(element);
      $scope.animationElements.push(elem);
    });
  };

  $scope.highlightSelection = function(branch) {
    console.log(branch.label);
  };

  $scope.$watch('newElements', function(elements) {
    if(elements > 0) {
      console.log("Elements");
      $scope.showNewElements();
    }
  }, true);

});

app.directive('animationElements', function() {
  return {
    templateUrl: '/directives/animation-elements/animation-elements.html',
    controller: 'animationElementsCtrl',
    replace: true,
    restrict: 'E'
  }
})
