'use strict';

app.controller('sequenceViewCtrl', function($scope, $resource, settings, paperFactory) {

  function init() {
    paper.install(window);
    paper.setup('sequenceCanvas');
    if (!angular.isDefined($scope.zoom)) {
      $scope.zoom = 1;
    }
    paper.view.zoom = $scope.zoom;
  }

  $scope.$watch('selectedSequence', function(newValue) {
    if (angular.isDefined(newValue)) {
      $scope.timelineElements = newValue.timelineElements;
      $scope.totalTimelineElements = $scope.timelineElements.length;
      $scope.toLoad = $scope.totalTimelineElements;
      angular.forEach($scope.timelineElements, function (timelineElement) {
        $scope.loading = 'Loading timeline element: ' + timelineElement.animationId;
        $resource(settings.get('rest.templ.animation-load-ilda')).get(
          {id: timelineElement.animationId},
          function (data) {
            timelineElement.animation = {
              id: data.metadata.id,
              name: data.metadata.name,
              framerate: data.metadata.frameRate,
              totalFrames: data.metadata.totalFrames,
              loopCount: data.metadata.loopCount,
              layers: data.layers
            };
            $scope.toLoad--;
          },
          function (error, status) {
            throwError('S002', error, status);
          });
      });
    }
  });

  $scope.$watch('toLoad', function(newValue) {
    if (newValue === 0) {
      angular.forEach($scope.timelineElements, function (timelineElement) {
        angular.forEach(timelineElement.animation.layers, function(frame) {
          $scope.addFrame(frame);
        });
      });
      paper.view.update();
    }
  });

  $scope.addFrame = function(frame) {
    var currentLayer = new Layer();
    currentLayer.name = frame.name;
    currentLayer.visible = true;
    angular.forEach(frame.children, function (element) {
      var paperObj = paperFactory.createElement(element);
      currentLayer.addChild(paperObj);
    });
  };

  init();
});

app.directive('sequenceView', function() {
  return {
    templateUrl: '/directives/sequence-view/sequence-view.html',
    restrict: 'E',
    replace: true,
    controller: 'sequenceViewCtrl'
  }
});
