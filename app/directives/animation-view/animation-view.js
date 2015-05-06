'use strict';

app.controller('animationViewCtrl', function($scope, $http, $resource, settings) {
  var viewWindow;

  function init() {
    var canvas = $('#animationCanvas')
    viewWindow = new paper.Rectangle(2,2,canvas.width()-4,canvas.height()-4);
    paper.install(window);
    paper.setup('animationCanvas');
    if ($scope.animation)
      loadAnimation($scope.animation);
  }

  function createPaperElement(element) {
    if (element.type === 'Path') {
      var path = new paper.Path();
      path.segments = element.segments;
      path.strokeColor = element.strokeColor;
      path.strokeWidth = element.strokeWidth;
      path.closed = element.closed;
      //path.fitBounds(viewWindow);
      path.scale(0.04);
      return path;
    }
    if (element.type === 'Group') {
      var group = new paper.Group();
      group.applyMatrix = child.applyMatrix;
      var children = new Array();
      angular.forEach(element.children, function(child) {
        children.push(createPaperElement(child));
      });
      group.children = children;
      return group;
    }
    if (element.type === 'PointText') {
      var pointText = new paper.PointText();
      pointText.applyMatrix = element.applyMatrix;
      pointText.content = element.content;
      pointText.fillColor = element.fillColor;
      pointText.font = element.font;
      pointText.fontFamily = element.fontFamily;
      pointText.fontSize = element.fontSize;
      pointText.fontWeight = element.fontWeight;
      pointText.leading = element.leading;
      pointText.matrix = element.matrix;
      return pointText;
    }
  }

   function loadAnimation(animation) {
    $resource(settings.get('rest.templ.animation-load-ilda')).get(
      {id: animation.id},
      function(data) {
        project.clear();
        angular.forEach(data.layers, function(layer) {
          var paperLayer = new paper.Layer();

          paperLayer.name = layer.name;
          paperLayer.visible = layer.visible;
          angular.forEach(layer.children, function(element) {
           paperLayer.addChild(createPaperElement(element));
          });
        });
        project.layers[0].visible = true;

        paper.view.draw();
      },
      function(data, status) {
        throw {
          message: 'Could not collected tiles from server',
          status: status
        }
      });
  };

  $scope.$watch('animation', function(selectedAnimation) {
    if (angular.isDefined(selectedAnimation)) {
      console.log('animationViewCtrl: animation selected: ' + selectedAnimation.name);
      loadAnimation(selectedAnimation);
    }
  });

  init();
});

app.directive('animationView', function() {
  return {
    templateUrl: '/directives/animation-view/animation-view.html',
    restrict: 'E',
    replace: true,
    controller: 'animationViewCtrl',
    scope: {
      animation: '='
    }
  }
});
