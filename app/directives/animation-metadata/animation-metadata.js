'use strict';

app.controller('animationMetadataCtrl', function($scope) {
  var framerate, loopCount;

  function init() {
    framerate = $('#framerate').spinner({
      spin: function( event, ui ) {
        $scope.animation.framerate = this.value;
      },
      change: function( event, ui ) {
        $scope.animation.framerate = this.value;
      }
    });
    framerate.val($scope.animation.framerate);
    loopCount = $('#loopCount').spinner({
      spin: function( event, ui ) {
        $scope.animation.loopCount = this.value;
      },
      change: function( event, ui ) {
        $scope.animation.loopCount = this.value;
      }
    });
    loopCount.val($scope.animation.loopCount);
  }

  $scope.toggleInfinitive = function() {
    if ($scope.loopCount == -1) {
      $scope.loopCount = 1;
      loopCount.spinner('enable');
    } else {
      $scope.loopCount = -1;
      loopCount.spinner('disable');
    }
  };

  $scope.$watch('animation.framerate', function(newValue) {
    framerate.val(newValue);
  });

  $scope.$watch('animation.loopCount', function(newValue) {
    loopCount.val(newValue);
  });

  $scope.updateFramerate = function() {
    $scope.animation.framerate = framerate.val();
  };

  $scope.updateLoopCount = function() {
    $scope.animation.loopCount = loopCount.val();
  };

  init();
});

app.directive('animationMetadata', function() {
  return {
    templateUrl: '/directives/animation-metadata/animation-metadata.html',
    controller: 'animationMetadataCtrl',
    replace: true
  }
});
