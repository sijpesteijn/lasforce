'use strict';

app.controller('animationEditCtrl', function($scope, $rootScope, $i18next, $resource, $interval, $location, paperFactory, history, settings) {
  paper.install(window);
  paper.setup('animationEditCanvas');
  var walkerInterval, currentLayer;
  $scope.frames = [];
  $scope.history = [];
  $scope.frameIndex = 0;
  $scope.currentFrame = 0;
  $scope.playing = false;
  $scope.newFrameCopyChildren = true;
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
          };
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

  //var tool, shape;
  //
  //function setRectangleTool() {
  //  tool = new Tool();
  //
  //  // Define a mousedown and mousedrag handler
  //  //tool.onMouseDown = function(event) {
  //  //  shape = new Path();
  //  //  shape.strokeColor = 'red';
  //  //  shape.add(event.point);
  //  //}
  //
  //  tool.onMouseDown = function (e) {
  //    shape = new Rectangle(new Point(10,10), new Size(10, 10));
  //    shape.strokeColor = 'red'; //$scope.color;
  //    shape.strokeWidth = 2;
  //    //project.activeLayer.addChild(shape);
  //    paper.view.update();
  //  }
  //
  //  //tool.onMouseDrag = function(event) {
  //  //  shape.add(event.point);
  //  //}
  //}

  function lineTool() {
    this.tool = new Tool();
    this.tool.fixedDistance = 50;
    this.drawing = false;
    this.nextPoint;
    this.line;
    this.path;
    this.selectedPoint;
    this.color = $scope.selectedColor;
    var that = this;
    this.addToHistory = function(parent, item) {
      var item = {
        type: 'path',
        parent: parent,
        item: item
      };
      history.add(item);
    };
    this.tool.onMouseDown = function (event) {
      if (event.event.button == 2) {
        event.preventDefault();
        that.drawing = false;
        that.line.remove();
        that.path.fullySelected = true;
      } else {
        if (that.drawing == false) {
          if (that.path) {
            if (that.path.fullySelected) {
              for(var i = 0;i<that.path.segments;i++) {
                if (Math.abs(that.path.segments[i].point.x - event.point.x) < 10 && Math.abs(that.path.segments[i].point.y - event.point.y) < 10) {
                  that.selectedPoint = i;
                }
              }
            }
            if (!that.selectedPoint)
              that.path.fullySelected = false;
          }
          if (!that.selectedPoint) {
            that.path = new Path();
            that.addToHistory(that.path);
            var point = event.point;
            that.path.add(point);
            that.addToHistory(that.path, that.path.segments[0]);
            that.path.strokeColor = that.color;
            that.path.strokeWidth = 2;
            that.nextPoint = new Point(event.event.offsetX + 1, event.event.offsetY + 1);
            that.line = new Path.Line(event.point, that.nextPoint);
            that.line.strokeColor = that.color;
            that.line.strokeWidth = 2;
            that.line.dashArray = [10, 12];
            that.drawing = true;
            $scope.$apply();
          }
        } else {
          var point = event.point;
          that.path.add(point);
          that.addToHistory(that.path, that.path.segments[that.path.segments.length-1]);
          that.line.remove();
          that.nextPoint = new Point(event.event.offsetX + 1, event.event.offsetY + 1);
          that.line = new Path.Line(event.point, that.nextPoint);
          that.line.strokeColor = that.color;
          that.line.strokeWidth = 2;
          that.line.dashArray = [10, 12];
          $scope.$apply();
        }
      }
    };
    this.tool.onMouseMove = function (event) {
      if (that.drawing == true) {
        that.line.segments[1].point = event.point;
      } else {
        if (that.selectedPoint) {
          that.path.segments[that.selectedPoint].point = event.point;
        }
      }
    };
    this.tool.onMouseUp = function(event) {
      if (angular.isDefined(that.selectedPoint))
        that.selectedPoint = null;
    };
    this.onColorChange = function(newColor) {
      this.color = newColor;
      this.line.strokeColor = newColor;
      if (this.drawing) {
        this.path = new Path();
        this.path.add(this.line.segments[0].point);
        this.path.strokeColor = newColor;
        this.path.strokeWidth = 2;
      }
    };
    this.onNewFrame = function() {
      that.path.fullySelected = false;
    };
    this.onDestroy = function() {

    };
  }

  function pathTool() {
    this.tool = new Tool();
    this.color = $scope.selectedColor;
    var that = this;
    this.tool.onMouseDown = function(event) {
      that.shape = new Path();
      that.shape.strokeColor = that.color;
      that.shape.strokeWidth = 2;
      that.shape.add(event.point);
    };

    this.tool.onMouseDrag = function(event) {
      that.shape.add(event.point);
    };
    this.onColorChange = function(newColor) {
      this.color = newColor;
    }
  }

  var newTool;
  $scope.$watch('selectedTool', function(newValue) {
    if (angular.isDefined(newValue)) {
      newTool = null;
      if (newValue === 'line') {
        newTool = new lineTool();
      }
      if (newValue === 'circle') {
        newTool = new circleTool();
      }
      if (newValue === 'path') {
        newTool = new pathTool();
      }
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
    console.log('COLOR: ' + selectedColor);
    $scope.selectedColor = selectedColor;

    if (newTool) {
      newTool.onColorChange(selectedColor);
    }
  }, true);

  function getFrameTime() {
    return (1 / $scope.animation.framerate) * $scope.frames.length * 1000;
  }

  function scrollCurrentFrameIntoView() {
    if ($scope.frames.length > 10) {
        $('.frame-list').scrollTop(19 * $scope.currentFrame);
    }
  }

  $scope.canUndo = function() {
    return history.canUndo();
  };

  $scope.undo = function() {
    history.undo();
    paper.view.update();
  };

  $scope.canRedo = function() {
    return history.canRedo();
  };

  $scope.getHistoryIndex = function() {
    return history.getHistoryIndex();
  };

  $scope.redo = function() {
    history.redo();
    paper.view.update();
  };

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
    if (newTool)
      newTool.onNewFrame();
    var children;
    if (project.layers.length > 0)
      children = project.activeLayer.children;
    if (project.layers.length > $scope.currentFrame)
      project.layers[$scope.currentFrame].visible = false;
    currentLayer = new Layer();
    if ($scope.newFrameCopyChildren && project.layers.length > 1) {
      angular.forEach(children, function(child) {
        project.activeLayer.addChild(child.clone());
      });
      paper.view.update();
    }
    var newName = $i18next('DRAW.NEW_FRAME') + ' ' + $scope.frameIndex;
    var frame = {
      index: $scope.frameIndex++,
      name: angular.isDefined(layer) ? layer.name : newName,
      edit: false
    };
    currentLayer.name = frame.name;
    currentLayer.visible = true;
    if (angular.isDefined(layer)) {
      angular.forEach(layer.children, function (element) {
        currentLayer.addChild(paperFactory.createElement(element));
      });
    }
    //currentLayer.activate();
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
