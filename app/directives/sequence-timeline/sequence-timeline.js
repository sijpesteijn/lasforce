'use strict';

app.controller('sequenceTimelineCtrl', function ($scope, $interval, $resource, settings) {
  var walkerInterval;
  $scope.playing = false;
  $scope.timelineZoom = 1 // = 100%
  $scope.currentTimelineElement;

  function getFrameTime() {
    if (angular.isUndefined($scope.currentTimelineElement))
      $scope.currentTimelineElement = $scope.selectedSequence.timelineElements[0];

    return (1 / $scope.currentTimelineElement.settings.framerate) * $scope.currentTimelineElement.animation.totalFrames * 1000;
  }

  function startWalker() {
    walkerInterval = $interval(function () {
      $scope.forward();
    }, getFrameTime());
  }

  $scope.save = function() {

  };

  $scope.rewind = function() {

  };

  $scope.backwards = function() {

  };

  $scope.togglePlay = function() {
    $scope.playing = !$scope.playing;
    if ($scope.playing) {
      startWalker();
    } else {
      $interval.cancel(walkerInterval);
    }
  };

  $scope.forward = function() {
    if (angular.isUndefined($scope.currentTimelineElement))
      $scope.currentTimelineElement = $scope.selectedSequence.timelineElements[0];
  };

  $scope.last = function() {

  };

  $scope.zoomIn = function () {
    $scope.zoom = Math.round(($scope.zoom + 0.1) * 10) / 10;
    paper.view.zoom = $scope.zoom;
    paper.view.update();
  };

  $scope.zoomOut = function () {
    if ($scope.zoom > 0.1) {
      $scope.zoom = Math.round(($scope.zoom - 0.1) * 10) / 10;
      paper.view.zoom = $scope.zoom;
      paper.view.update();
    }
  };

  $scope.$watch("selectedSequence", function(newValue) {
    if (angular.isDefined(newValue)) {

      $scope.timelineElements = newValue.timelineElements ? newValue.timelineElements : [];
      $scope.totalTimelineElements = $scope.timelineElements.length;
    }
  }, false);
});

app.directive('sequenceTimeline', function () {
  return {
    templateUrl: '/directives/sequence-timeline/sequence-timeline.html',
    restrict: 'E',
    replace: true,
    controller: 'sequenceTimelineCtrl',
    link: function (scope, element) {

      function init() {
        scope.timelineElements = [] ;
        scope.totalTimelineElements = 0;

        var options = {
          drop: function (event, ui) {
            var animation = angular.element(ui.draggable).scope().animation;
            var ani = {
              animationId: animation.id,
              position: scope.totalTimelineElements++,
              settings: {
                framerate: animation.framerate,
                loop: animation.loopCount
              }
            }
            scope.timelineElements.push(ani);
            scope.selectedSequence.timelineElements = scope.timelineElements;
            scope.$apply();
          }

        };

        element.droppable(options);
      }

      init();
    }
  }
});

app.directive('timelineElement', function () {
  return {
    templateUrl: 'directives/sequence-timeline/timeline-element.html',
    replace: true,
    restrict: 'E',
    link: function (scope, element) {

      function init() {
        var options = {
          cursor: "move",
          axis: "x",
          helper: function( event ) {
            return $( '<div class="dragging">' + scope.animation.name + '</div>' );
          }
        };
        element.draggable(options);
      }

      init();
    },
    controller: function($scope, $resource, settings) {

      $scope.getWidth = function () {
        if (angular.isDefined($scope.timelineElement.animation)) {
          var rate = 1 / $scope.timelineElement.animation.framerate;
          var width = $scope.timelineElement.animation.totalFrames * rate * 1000 * $scope.timelineZoom;
          return width;
        }
        return 100;
      };
    }
  }
});
