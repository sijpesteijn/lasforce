'use strict';

app.controller('sequenceListCtrl', function($scope, $resource, settings) {
  $scope.sequences = [];

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
        $scope.sequences.push(data);
        $scope.openAddSequence = false;
        $scope.newSequence = '';
      },
      function(error, status) {
        throwError('S003', error, status);
      });
  };

  function init() {
    $resource(settings.get('rest.templ.sequence-list')).query(
      null,
      function(data) {
        angular.forEach(data, function(sequence) {
          $scope.sequences.push(sequence);
        });
        if ($scope.sequences.length > 0) {
          $scope.selectedSequence = $scope.sequences[0];
        }
      },
      function(error, status) {
        throwError('S001', error, status);
      });
  }

  $scope.save = function() {
    $resource(settings.get('rest.templ.sequence-update')).save(
      null,
      $scope.selectedSequence,
      function(data) {
      },
      function(error, status) {
        throwError('S003', error, status);
      });
  };

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
