'use strict';

app.controller('animationViewCtrl', function ($scope, $http, $resource, $interval, paperWrapper, settings) {
  var autoplayInterval;
  $scope.current_frame_id = 0;
  $scope.autoPlay = angular.isUndefined($scope.autoPlay) ? true : $scope.autoPlay;
  $scope.loopCount = angular.isUndefined($scope.loopCount) ? -1 : $scope.loopCount;
  $scope.zoom = 0.009;

  $scope.init = function() {
    paperWrapper.setup('animationCanvas');
  };

  function stop() {
    $interval.cancel(autoplayInterval);
    $scope.playing = false;
  }

  function stopAndClear() {
    stop();

    project.clear();
    paper.view.draw();
    $scope.name = '';
    $scope.frameRate = 0;
    $scope.frameTime = 0;
    $scope.current_frame_id = 0;
  }

  function getFrameTime() {
    return (1 / $scope.framerate) * $scope.totalFrames * 1000;
  }

  function loadAnimation(animationId) {
    if ($scope.playing) {
      stopAndClear();
    }
    $scope.loading = true;
    $resource(settings.get('rest.templ.animation')).get(
      {id: animationId},
      function (data) {
        $scope.loading = false;
        $scope.current_frame_id = 0;
        $scope.totalFrames = data.layers.length;
        $scope.name = data.metadata.name;
        $scope.framerate = data.metadata.framerate;
        project.clear();
        angular.forEach(data.layers, function (layer) {
          var paperLayer = new Layer();

          paperLayer.name = layer.name;
          paperLayer.visible = layer.visible;
          angular.forEach(layer.children, function (element) {
            paperLayer.addChild(paperFactory.createElement(element));
          });
        });
        project.layers[$scope.current_frame_id].visible = true;
        paper.view.update();
        //paper.view.zoom = $scope.zoom;
        if ($scope.autoPlay) {
          $scope.playing = true;
          $scope.frameTime = getFrameTime();
          $interval.cancel(autoplayInterval);
          autoplayInterval = $interval(function () {
            project.layers[$scope.current_frame_id].visible = false;
            project.layers[getNextFrameNr()].visible = true;
            paper.view.update();
          }, $scope.frameTime);
        }
      },
      function (data, status) {
        $scope.loading = false;
        throw {
          message: 'Could not collected tiles from server',
          status: status
        }
      });
  }

  function getNextFrameNr() {
    if ($scope.current_frame_id !== $scope.totalFrames - 1) {
      $scope.current_frame_id++;
    } else {
      if ($scope.loopCount == -1 || $scope.loopCount > 0) {
        $scope.loopCount > 0 ? $scope.loopCount-- : -1; // decrement loopCount if > 0
        if ($scope.loopCount == 0) {
          stop();
        }
        $scope.current_frame_id = 0;
      } else {
        stop();
      }
    }
    return $scope.current_frame_id;
  }

  $scope.$watch('animationId', function (animationId) {
    if (angular.isDefined(animationId)) {
      console.log('animationViewCtrl: animation selected: ' + animationId);
      loadAnimation(animationId);
    } else if (angular.isUndefined(animationId) && $scope.playing) {
      stopAndClear();
    }
  });

  $scope.$on('$destroy', function() {
    console.log("destroy");
    $interval.cancel(autoplayInterval);
  });

  $scope.init();
});

app.directive('animationView', function () {
  return {
    templateUrl: 'directives/animation-view/animation-view.html',
    restrict: 'E',
    replace: true,
    controller: 'animationViewCtrl',
    scope: {
      animationId: '=',
      loopCount: '=',
      autoPlay: '='
    }
  }
});
