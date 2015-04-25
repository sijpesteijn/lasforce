'use strict';

app.controller('timeLineCtrl', function ($scope) {
  function init() {
    $scope.totalTimelineElements = 0;
    $scope.timelineElements = [
      //{
      //  name: "Peacedove"
      //},
      //{
      //  name: "Skull"
      //}
    ];
    $scope.timelineSelectedElement = $scope.timelineElements[0];
    $('.timeline').sortable({
      axis: "x",
      revert: true
    });
    $('.timeline').droppable(
      {
        hoverClass: "timeline-hover",
        drop: function(event, ui) {
          var animation = angular.element(ui.draggable).scope().animation;
          var ani = {
            name: animation.name,
            position: $scope.totalTimelineElements++
          }
          $scope.timelineElements.push(ani);
          $scope.$apply();
          console.log('DROPPED');
        },
        over: function(event, ui){
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
      element.draggable(
        {
          //axis: "x" ,
          snap: ".timeline"
        });
      element.resizable({
        handles: {
          'e': '.egrip',
          'w': '.wgrip'
        }
      });
    },
    controller: function($scope, $modal) {

      $scope.select = function () {
        $scope.$parent.timelineSelectedElement = $scope.timelineElement.position;
      };

      $scope.open = function () {
        $modal.open({
          templateUrl: '/directives/timeline/animationSettings.html',
          backdrop: 'static',
          controller: function ($scope, $modalInstance) {

          }
        });
      }
    },
    replace: true,
    restrict: 'E'
  }
});

app.directive('timelineElementInfo', function() {
  return {
    templateUrl: 'directives/timeline/timelineElementInfo.html',
    replace: true,
    restrict: 'E'
  }
});
