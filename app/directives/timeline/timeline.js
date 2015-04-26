'use strict';

app.controller('timeLineCtrl', function ($scope) {

  function init() {
    $scope.timelineColor = '#000000';
    $scope.totalTimelineElements = 0;
    $scope.totalSeconds = 11;
    $scope.totalTime = 10300;
    $scope.timelineElements = [];
    $scope.timelineSelectedElement = $scope.timelineElements[0];
    $('.timeline').sortable({
      //axis: "x",
      revert: true
    });
    $('.timeline').droppable(
      {
        hoverClass: "timeline-hover",
        drop: function (event, ui) {
          var animation = angular.element(ui.draggable).scope().animation;
          var ani = {
            name: animation.name,
            animation: animation,
            position: $scope.totalTimelineElements++,
            settings: {
              framerate: 24,
              loop: 3
            }
          }
          $scope.timelineElements.push(ani);
          $scope.$apply();
          console.log('DROPPED');
        },
        over: function (event, ui) {
          console.log('OVER');
        }
      })
  };

  init();
});

app.directive('timeLine', function () {
  return {
    templateUrl: 'directives/timeline/timeline.html',
    controller: 'timeLineCtrl',
    replace: true,
    restrict: 'E'
  }
});

app.directive('timelineElement', function () {
  return {
    templateUrl: 'directives/timeline/timeline-element.html',
    link: function (scope, element, attrs, modal) {
      var that = this;
      element.draggable(
        {
          axis: "x"
        });
      element.resizable({
        handles: {
          'e': '.egrip',
          'w': '.wgrip'
        },
        resize: function (event, ui) {
          angular.element(ui.element).scope().timelineElement.settings.framerate = ui.size.width;
          console.log('RESIZING ' + angular.element(ui.element).scope().timelineElement.settings.framerate);
        }
      });
    },
    controller: function ($scope, $modal) {

      $scope.select = function () {
        $scope.$parent.timelineSelectedElement = $scope.timelineElement.position;
      };

      $scope.open = function () {
        $modal.open({
          templateUrl: '/directives/timeline/timeline-element-settings-modal.html',
          backdrop: 'static',
          resolve: {
            timelineElement: function () {
              return angular.copy($scope.timelineElement);
            }
          },
          controller: function ($scope, $modalInstance, timelineElement) {
            $scope.timelineElement = timelineElement;
            $scope.loopInfinite = false;
            var oldLoop = $scope.timelineElement.settings.loop;
            $("#framerate-spinner").spinner();
            $("#loopSpinner").spinner({
              min: 1
            });

            $scope.$watch('loopInfinite', function (newValue) {
              if (newValue === true) {
                $('#loopSpinner').prop('disabled', true);
                oldLoop = $scope.timelineElement.settings.loop;
                $scope.timelineElement.settings.loop = -1;
              } else {
                $('#loopSpinner').prop('disabled', false);
                $scope.timelineElement.settings.loop = oldLoop;
              }
            });

            $scope.save = function () {
              $modalInstance.close($scope.timelineElement);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss();
            };
          }
        }).result.then(function (timelineElement) {
            $scope.timelineElement.settings = timelineElement.settings;
          });
      }
    },
    replace: true,
    restrict: 'E'
  }
});

app.directive('timelineElementInfo', function () {
  return {
    templateUrl: 'directives/timeline/timelineElementInfo.html',
    replace: true,
    restrict: 'E'
  }
});

app.directive('timelineElementSettings', function () {
  return {
    templateUrl: 'directives/timeline/timeline-element-settings.html',
    replace: true,
    restrict: 'E',
    scope: {
      settings: '='
    }
  }
});

app.directive('timeScale', function () {
  return {
    templateUrl: 'directives/timeline/time-scale.html',
    replace: true,
    restrict: 'E',
    controller: function ($scope, $interval) {
      $scope.zoom = 1;
      $scope.playing = false;
      $scope.walker = 10;
      var walkerInterval;

      function init() {
      }

      $scope.togglePlay = function () {
        $scope.playing = !$scope.playing;
        if ($scope.playing) {
          var time = new Date().getTime();
          walkerInterval = $interval(function () {
            $scope.walker = $scope.walker + 2 * $scope.zoom;
          }, 50);
        } else {
          $interval.cancel(walkerInterval);
        }
      };

      $scope.rewind = function() {
        $scope.walker = 0;
      }

      $scope.setWalker = function ($event) {

      };

      $scope.$watch('zoom', function (newValue) {
        $scope.zoomProcentage = Math.round($scope.zoom * 100);
      });

      $scope.zoomIn = function () {
        $scope.zoom = Math.round(($scope.zoom + 0.1) * 10) / 10;
      };

      $scope.zoomOut = function () {
        if ($scope.zoom > 0.1)
          $scope.zoom = Math.round(($scope.zoom - 0.1) * 10) / 10;
      };

      init();
    }
  }
});

app.directive('timeScaleSecond', function () {
  return {
    templateUrl: 'directives/timeline/time-scale-second.html',
    replace: true,
    restrict: 'E',
    controller: function ($scope) {
      $scope.fill = 10;

      function init() {
        var tillNow = $scope.$index * 1000;
        if ($scope.totalTime - tillNow < 1000) {
          $scope.fill = ($scope.totalTime - tillNow) / 100;
        }
      };

      $scope.$watch('zoom', function (newValue) {
        $scope.offset = ($scope.$index * 40) * $scope.zoom;
        $scope.nrOffset = $scope.$index > 9 ? (-2 * $scope.zoom) : 0;

      });

      $scope.getSecondsMarkerX = function () {
        return $scope.offset;
      };

      $scope.getSecondsX = function () {
        return $scope.offset + $scope.nrOffset - 2;
      };

      $scope.getHundredsMarkerX = function (index) {
        return $scope.offset + ((4 * $scope.zoom) * (index + 1));
      };

      init();
    }
  }
});
