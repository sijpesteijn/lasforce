'use strict';

app.controller('animationElementsCtrl', function($scope) {


});

app.directive('animationElements', function() {
  return {
    templateUrl: '/directives/animation-elements/animation-elements.html',
    controller: 'animationElementsCtrl',
    replace: true,
    restrict: 'E'
  }
})
