'use strict';

app.controller('animationEditCtrl', function($scope, $rootScope, $i18next, $resource, $interval, $location, paperFactory, settings) {
  paper.install(window);
  paper.setup('animationEditCanvas');
  var walkerInterval, currentLayer;
  $scope.frames = [];
  $scope.frameIndex = 0;
  $scope.currentFrame = 0;
  $scope.playing = false;
  $scope.loop = true;
  $scope.animation = {
    name: 'A Name',
    framerate: 30,
    loopCount: 1
  };

  function init() {
    project.clear();
    if (!angular.isDefined($scope.zoom)) {
      $scope.zoom = 1;
    }
    paper.view.zoom = $scope.zoom;
    var params = $location.search();
    if (angular.isDefined(params.animationId) && !isNaN(params.animationId)) {
      var animationId = params.animationId;
      $resource(settings.get('rest.templ.animation-load-ilda')).get(
        {id: animationId},
        function (data) {
          $scope.animation = {
            name: data.metaData.name,
            framerate: data.metaData.frameRate,
            loopCount: data.metaData.loopCount
          }
          angular.forEach(data.layers, function(frame) {
            $scope.addFrame(frame);
          });
          $scope.currentFrame = 0;
          project.layers[$scope.currentFrame].visible = true;
          paper.view.update();
        },
        function(error) {

        });
    } else {
      $scope.addFrame();
      project.layers[$scope.currentFrame].visible = true;
      paper.view.update();
    }
  }

  var tool, shape;

  function setRectangleTool() {
    tool = new Tool();

    // Define a mousedown and mousedrag handler
    //tool.onMouseDown = function(event) {
    //  shape = new Path();
    //  shape.strokeColor = 'red';
    //  shape.add(event.point);
    //}

    tool.onMouseDown = function (e) {
      shape = new Rectangle(new Point(10,10), new Size(10, 10));
      shape.strokeColor = 'red'; //$scope.color;
      shape.strokeWidth = 2;
      //project.activeLayer.addChild(shape);
      paper.view.update();
    }

    //tool.onMouseDrag = function(event) {
    //  shape.add(event.point);
    //}
  }

  function setLineTool() {
    var drawTool = new Tool();
    var drawing = false;
    var path;
    var nextPoint;
    var line;
    drawTool.onMouseDown = function (e) {
      if (e.event.button == 2) {
        e.preventDefault();
        drawing = false;
        line.remove();
      } else {
        if (drawing == false) {
          path = new paper.Path();
          path.add(e.point);
          path.strokeColor = $scope.selectedColor;
          path.strokeWidth = 2;
          nextPoint = new Point(e.event.offsetX + 1, e.event.offsetY + 1);
          line = new Path.Line(e.point, nextPoint);
          line.strokeColor = $scope.selectedColor;
          line.strokeWidth = 2;
          line.dashArray = [10, 12];
          drawing = true;
        } else {
          path.add(e.point);
          line.remove();
          nextPoint = new Point(e.event.offsetX + 1, e.event.offsetY + 1);
          line = new Path.Line(e.point, nextPoint);
          line.strokeColor = $scope.selectedColor;
          line.strokeWidth = 2;
          line.dashArray = [10, 12];
        }
      }
    }
    drawTool.onMouseMove = function (e) {
      if (drawing == true) {
        line.segments[1].point = e.point;
      }
    }
  }

  $scope.$watch('selectedTool', function(newValue) {
    if (angular.isDefined(newValue)) {
      if (newValue === 'line') {
        setLineTool();
      }
      //var shape;
      //if (newValue === 'rectangle') {
      //  tool.onMouseDown = function (event) {
      //    var rect = new Rectangle(new Point(10, 120), new Point(210, 20));
      //    rect.strokeColor = 'red';
      //    rect.fillColor = 'red';
      //    rect.strokeWidth = 2;
      //    //shape.strokeColor = 'red';
      //    //var circle = new Path.Circle(event.middlePoint, 50);
      //  }
      //} else
      //else {
      //
      //var tool = new Tool();
      //  // Define a mousedown and mousedrag handler
      //  tool.onMouseDown = function(event) {
      //    shape = new Path();
      //    shape.strokeColor = $scope.selectedColor;
      //    shape.add(event.point);
      //  }
      //
      //  tool.onMouseDrag = function(event) {
      //    shape.add(event.point);
      //  }
      //
      //}
    }
  });

  $scope.$watch('animation', function(newValue) {
    if ($scope.playing) {
      $interval.cancel(walkerInterval);
      walkerInterval = $interval(function () {
        $scope.forward();
      }, getFrameTime());
    }
  }, true);

  $scope.$watch('selectedColor', function(selectedColor) {
    console.log('SELECTED COLOR: ' + selectedColor);
  }, true);

  function getFrameTime() {
    return (1 / $scope.animation.framerate) * $scope.frames.length * 1000;
  }

  function scrollCurrentFrameIntoView() {
    if ($scope.frames.length > 10) {
        $('.frame-list').scrollTop(19 * $scope.currentFrame);
    }
  }

  $scope.rewind = function() {
    project.layers[$scope.currentFrame].visible = false;
    $scope.currentFrame = 0;
    project.layers[$scope.currentFrame].visible = true;
    paper.view.update();
    scrollCurrentFrameIntoView();
  };

  $scope.backward = function() {
    project.layers[$scope.currentFrame].visible = false;
    if ($scope.currentFrame == 0) {
      if ($scope.loop)
        $scope.currentFrame = $scope.frames.length -1;
    }
    else
      $scope.currentFrame--;
    project.layers[$scope.currentFrame].visible = true;
    paper.view.update();
    scrollCurrentFrameIntoView();
  };

  $scope.forward = function() {
    if (project.layers.length > $scope.currentFrame)
      project.layers[$scope.currentFrame].visible = false;
    if ($scope.currentFrame == $scope.frames.length -1) {
      if ($scope.loop)
        $scope.currentFrame = 0;
      else if ($scope.playing)
        $scope.togglePlay();
    }
    else
      $scope.currentFrame++;
    project.layers[$scope.currentFrame].visible = true;
    paper.view.update();
    scrollCurrentFrameIntoView();
  };

  $scope.last = function() {
    project.layers[$scope.currentFrame].visible = false;
    $scope.currentFrame = $scope.frames.length - 1;
    project.layers[$scope.currentFrame].visible = true;
    paper.view.update();
    scrollCurrentFrameIntoView();
  }

  $scope.setCurrentFrame = function(index) {
    project.layers[$scope.currentFrame].visible = false;
    $scope.currentFrame = index;
    project.layers[$scope.currentFrame].visible = true;
    paper.view.update();
  }

  function startWalker() {
    walkerInterval = $interval(function () {
      $scope.forward();
    }, getFrameTime());
  }

  $scope.togglePlay = function() {
    $scope.playing = !$scope.playing;
    if ($scope.playing) {
      startWalker();
    } else {
      $interval.cancel(walkerInterval);
    }
  };

  $scope.toggleLoop = function() {
    $scope.loop = !$scope.loop;
  }

  $scope.addFrame = function(layer) {
    if (project.layers.length > $scope.currentFrame)
      project.layers[$scope.currentFrame].visible = false;
    currentLayer = new Layer();
    var newName = $i18next('DRAW.NEW_FRAME') + ' ' + $scope.frameIndex;
    var frame = {
      index: $scope.frameIndex++,
      name: angular.isDefined(layer) ? layer.name : newName,
      edit: false
    };
    currentLayer.name = frame.name;
    currentLayer.visible = frame.visible;
    if (angular.isDefined(layer)) {
      angular.forEach(layer.children, function (element) {
        currentLayer.addChild(paperFactory.createElement(element));
      });
    }
    currentLayer.activate();
    $scope.frames.push(frame);
    $scope.currentFrame = frame.index;
    scrollCurrentFrameIntoView();
  };

  $scope.removeFrame = function(id) {
    if ($scope.frames.length > 1) {
      if ($scope.currentFrame == id) {
        $scope.backward();
      }
      var index = 0;
      angular.forEach($scope.frames, function(frame) {
        if (frame.index == id) {
          $scope.frames.splice(index, 1);
          project.layers.splice(index, 1);
          paper.view.update();
        }
        index++;
      });
      if ($scope.currentFrame > $scope.frames.length - 1) {
        $scope.currentFrame = $scope.frames.length - 1;
      }
    }
  };

  init();
});

app.directive('animationEdit', function() {
  return {
    templateUrl: '/directives/animation-edit/animation-edit.html',
    controller: 'animationEditCtrl',
    replace: true,
    restrict: 'E'
  }
});
