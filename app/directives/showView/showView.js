'use strict';

app.controller('showViewCtrl', function($scope, $resource, settings) {
  $scope.sequences = [];
  $scope.predicate = 'id';
  $scope.showViewGrid = {
    margins: [20, 20],
    columns: 12,
    draggable: {
      handle: 'h3'
    },
    resizable: {
      enabled: false
    }
  };

  $scope.createSequence = function() {
    var sequence = {
      name: $scope.newSequence
    };
    $scope.selectedShow.sequences.push(sequence);
    $resource(settings.get('rest.templ.show-update')).save(
      null,
      $scope.selectedShow

      //function(data) {
      //  $scope.selectedShow.sequences;
      //  $scope.tiles.push(data);
      //  $scope.openAddShow = false;
      //  $scope.newShow = '';
      //},
      //function(data, status) {
      //  throw {
      //    message: 'Could not save show',
      //    status: status
      //  }
      //}
    );
  };

  $scope.loadShow = function(show) {
    $resource(settings.get('rest.templ.show-list')).query(
      show.id,
      function(data) {
        $scope.tiles = data;
      },
      function(data, status) {
        throw {
          message: 'Could not collected tiles from server',
          status: status
        }
      });
  };

  $scope.$watch('selectedShow', function(selectedShow) {
    if (angular.isDefined(selectedShow)) {
      $scope.loadShow(selectedShow);
    }
  });
});

app.directive('showView', function() {
  return {
    templateUrl: '/directives/showView/showView.html',
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'showViewCtrl'
  }
});
