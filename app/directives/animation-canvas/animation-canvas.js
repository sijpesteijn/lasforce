'use strict';

app.controller('animationCanvasCtrl', function($scope) {

});

app.directive('animationCanvas', function() {
  return {
    templateUrl: '/directives/animation-canvas/animation-canvas.html',
    controller: 'animationCanvasCtrl',
    replace: true,
    restrict: 'E'
  }
});
