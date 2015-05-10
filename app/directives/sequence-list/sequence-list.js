'use strict';

app.controller('sequenceListCtrl', function($scope, $resource, settings) {
  $scope.tiles = [];
  $scope.sequenceListGrid = {
    margins: [20, 20],
    columns: 12,
    draggable: {
      handle: 'h3'
    },
    resizable: {
      enabled: false
    }
  };

  $scope.setSequence = function(sequence) {
    $scope.selectedSequence = sequence;
  };

  $scope.createSequence = function() {
    var sequence = {
      name: $scope.newSequence
    };
    $resource(settings.get('rest.templ.sequence-update')).save(
      null,
      sequence,
      function(data) {
        $scope.selectedSequence = data;
        var tile = {
          sequence: data,
          sizeX: 2,
          sizeY: 2
        }
        $scope.tiles.push(tile);
        $scope.openAddSequence = false;
        $scope.newSequence = '';
      },
      function(data, status) {
        throw {
          message: 'Could not save sequence',
          status: status
        }
      });
  };

  function init() {
    $resource(settings.get('rest.templ.sequence-list')).query(
      null,
      function(data) {
        angular.forEach(data, function(sequence) {
          var tile = {
            sequence: sequence,
            sizeX: 2,
            sizeY: 2
          }
          $scope.tiles.push(tile);
        });
        if ($scope.tiles.length > 0) {
          $scope.selectedSequence = $scope.tiles[0].sequence;
        }
      },
      function(data, status) {
        throw {
          message: 'Could not collect sequences from server',
          status: status
        }
      });
  }

  init();
});

app.directive('sequenceList', function() {
  return {
    templateUrl: '/directives/sequence-list/sequence-list.html',
    controller: 'sequenceListCtrl',
    restrict: 'E',
    replace: true
  }
});
