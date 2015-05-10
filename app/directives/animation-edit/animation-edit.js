'use strict';

app.controller('animationEditCtrl', function($scope, $i18next, $resource, $interval, $location, paperFactory, settings) {
  paper.install(window);
  paper.setup('animationEditCanvas');
  var drawHandler, walkerInterval;
  $scope.frames = [];
  $scope.frameIndex = 0;
  $scope.currentFrame = 0;
  $scope.playing = false;
  $scope.loop = true;
  $scope.zoom = 0.009;
  $scope.animation = {
    name: 'A Name',
    framerate: 30,
    loopCount: 1
  };

  function init() {
    project.clear();
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
      $scope.currentFrame = 0;
      project.layers[$scope.currentFrame].visible = true;
      paper.view.update();
    }
  }

  $scope.$watch('selectedTool', function(newValue) {
    drawHandler = paperFactory.createToolHandler(newValue);
  });

  $scope.$watch('animation', function(newValue) {
    if ($scope.playing) {
      $interval.cancel(walkerInterval);
      walkerInterval = $interval(function () {
        $scope.forward();
      }, getFrameTime());
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
    project.activeLayer.visible = false;
    var newLayer = new paper.Layer();
    var newName = $i18next('DRAW.NEW_FRAME') + ' ' + $scope.frameIndex;
    var frame = {
      index: $scope.frameIndex++,
      name: angular.isDefined(layer) ? layer.name : newName,
      edit: false
    };
    newLayer.name = frame.name;
    newLayer.visible = frame.visible;
    if (angular.isDefined(layer)) {
      angular.forEach(layer.children, function (element) {
        newLayer.addChild(paperFactory.createElement(element));
      });
    }
    $scope.frames.push(frame);
    $scope.currentFrame = frame.index;
    //project.layers[$scope.currentFrame].visible = false;
    //paper.view.update();
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
