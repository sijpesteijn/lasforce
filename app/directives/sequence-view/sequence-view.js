'use strict';

app.controller('sequenceViewCtrl', function($scope) {
  $scope.tiles = [];
  $scope.sequenceGrid = {
    margins: [20, 20],
    columns: 12,
    draggable: {
      handle: 'h3'
    },
    resizable: {
      enabled: false
    }
  };

  function loadSequenceAnimations() {
    angular.forEach($scope.selectedSequence.animations, function(animation) {
      var tile = {
        animation: animation,
        sizeX: 2,
        sizeY: 2
      }
      $scope.tiles.push(tile);
    });
  }

  $scope.$watch('selectedSequence', function(selectedSequence) {
    if (angular.isDefined(selectedSequence)) {
      console.log('sequenceViewCtrl: sequence selected: ' + selectedSequence.name);
      loadSequenceAnimations()
    }
  });

});

app.directive('sequenceView', function() {
  return {
    templateUrl: '/directives/sequence-view/sequence-view.html',
    restrict: 'E',
    replace: true,
    controller: 'sequenceViewCtrl'
  }
});
