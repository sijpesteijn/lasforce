'use strict';

app.controller('drawToolInfoCtrl', function($scope) {

});

app.directive('drawToolInfo', function () {
  return {
    templateUrl: '/directives/draw-tool-info/draw-tool-info.html',
    replace: true,
    restrict: 'E',
    controller: 'drawToolInfoCtrl'
  }
});
