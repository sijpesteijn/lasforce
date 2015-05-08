'use strict';

app.controller('timeLineCtrl', function ($scope, $interval, $timeout) {
  $scope.timelineColor = '#000000';
  $scope.totalTimelineElements = 0;
  $scope.zoom = 1; // 100%
  $scope.totalSeconds = 0;
  $scope.totalTime = 0;
  $scope.paddingLeft = 5;
  $scope.timelineElements = [
    //{
    //  name: "tron1.ild",
    //  animation: {id: 1430165084934, name: "tron1.ild", lastUpdate: 1430165084934, frameRate: 10, nrOfFrames: 10},
    //  position: 1,
    //  settings: {loop: 3}
    //}
  ];
  $scope.timelineSelectedElement = $scope.timelineElements[0];
  $scope.playing = false;
  $scope.walker = $scope.paddingLeft + 0;
  $scope.elapsed = 0;

  var walkerInterval;
  var start = new Date().getTime();
  var now;


  function calculateTimes() {
    $scope.totalTime = 0;
    angular.forEach($scope.timelineElements, function (timelineElement) {
      $scope.totalTime = $scope.totalTime + (1 / timelineElement.animation.frameRate) * timelineElement.animation.nrOfFrames;
    });
    $scope.totalSeconds = Math.ceil($scope.totalTime);
  }

  function init() {
    //var timescale = $('.time-scale');
    //timescale.on('mouseover', function(event, i) {
    //  timescale.addClass('.time-scale-hover');
    //});
    //timescale.on('mouseout', function(event, i) {
    //  timescale.removeClass('.time-scale-hover');
    //});
    $('.time-scale-container').sortable({
      //axis: "x",
      revert: true
    });
    $('.time-scale-container').droppable(
      {
        hoverClass: "time-scale-hover",
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
          calculateTimes();
          $scope.$apply();
          console.log('DROPPED');
        },
        over: function (event, ui) {
          console.log('OVER');
        }
      })
  };

  $scope.$watch('timelineElements', function () {
    calculateTimes();
  }, true);

  $scope.$watch('zoom', function () {
    if (now)
      $scope.walker = (now - start) * $scope.zoom / 5;
  });


  function setWalker() {
    now = new Date().getTime();
    if (now - start > 50) {
      $scope.walker = $scope.walker*$scope.zoom + (now-start)/10; //((now - start) * $scope.zoom)/100;
      start = new Date().getTime();
    }
    //$scope.elapsed = (now - start);
    //console.log($scope.walker + ' ' + $scope.totalTime * 50 * $scope.zoom);
    //if ($scope.walker / 100 > $scope.totalTime * $scope.zoom) {
    //  $scope.walker = 2;
    //  start = new Date().getTime();
    //}
  };

  $scope.togglePlay = function () {
    if ($scope.totalTime > 0) {
      $scope.playing = !$scope.playing;
      if ($scope.playing) {
        walkerInterval = $interval(function () {
          setWalker();
        }, 50);
        $timeout(function () {
          $scope.togglePlay();
        }, 1000);
      } else {
        $interval.cancel(walkerInterval);
      }
    }
  };

  $scope.rewind = function () {
    $scope.walker = $scope.paddingLeft + 0;
  }

  $scope.setWalker = function ($event) {

  };

  $scope.zoomIn = function () {
    $scope.zoom = Math.round(($scope.zoom + 0.1) * 10) / 10;
  };

  $scope.zoomOut = function () {
    if ($scope.zoom > 0.1)
      $scope.zoom = Math.round(($scope.zoom - 0.1) * 10) / 10;
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
    link: function (scope, element) {
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
          var animation = angular.element(ui.element).scope().timelineElement.animation;
          var total = ui.size.width / (100 * scope.zoom);
          animation.frameRate = 10 / total;
          scope.$apply();
        }
      });
    },
    controller: function ($scope, $modal) {

      $scope.select = function () {
        $scope.$parent.timelineSelectedElement = $scope.timelineElement;
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

      $scope.getWidth = function () {
        var rate = 1 / $scope.timelineElement.animation.frameRate;
        var width = $scope.timelineElement.animation.nrOfFrames * rate * 100 * $scope.zoom;
        return width;
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
    transclude: true,
    controller: function ($scope) {

      $scope.$watch('zoom', function () {
        $scope.zoomProcentage = Math.round($scope.zoom * 100);
      });

    }
  }
});

app.directive('timeScaleSecond', function () {
  return {
    templateUrl: 'directives/timeline/time-scale-second.html',
    replace: true,
    transclude: true,
    restrict: 'E',
    link: function ($scope) {
      $scope.fill = 9;

      //$scope.$watch('totalTime', function () {
      //  var tillNow = $scope.$index;
      //  if ($scope.totalTime - tillNow < ($scope.$index + 1)) {
      //    $scope.fill = ($scope.totalTime - tillNow) * 10;
      //  } else {
      //    $scope.fill = 10;
      //  }
      //});

      $scope.$watch('zoom', function (newValue) {
        $scope.start = $scope.paddingLeft + ($scope.$index * 100) * $scope.zoom;
        $scope.nrOffset = $scope.$index > 9 ? (-2 * $scope.zoom) : 0;

      });

      $scope.getSecondsX = function () {
        if (angular.isDefined($scope.start) && angular.isDefined($scope.nrOffset))
          return $scope.start + $scope.nrOffset - 2;
        return 0;
      };

      $scope.getLastSecondsX = function() {
        return $scope.$index + 1 > 9 ? ($scope.$index+1)*100*$scope.zoom : (($scope.$index+1)*100*$scope.zoom) -2;
      }
      $scope.getHundredsMarkerX = function (index) {
        return $scope.start + ((10 * $scope.zoom) * (index + 1));
      };

    }
  }
});

app.directive('timeControls', function() {
  return {
    templateUrl: 'directives/timeline/time-controls.html',
    replace: true,
    restrict: 'E'
  }
})
