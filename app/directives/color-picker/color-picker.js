'use strict';

app.controller('colorpickerCtrl', function ($rootScope, $scope) {

  $scope.openColorPick = function() {
    $scope.colorValue = angular.isUndefined($scope.colorValue) ? 'white' : $scope.colorValue;
    var cp = $('.color-box')
      .colpick({
      colorScheme: 'dark',
      layout: 'hex',
      color: $scope.colorValue,
      onSubmit: function (hsb, hex, rgb, el) {
        $(el).css('background-color', '#' + hex);
        $(el).colpickHide();
        $scope.colorValue = '#' + hex;
      },
      onChange: function(hsb, hex, rgb, el) {

      }
    }).css('background-color', this.value);
  }

})
  .directive('colorpicker', function () {

    return {
      templateUrl: '/directives/color-picker/color-picker.html',
      controller: 'colorpickerCtrl',
      restrict: 'E',
      replace: true,
      scope: {
        colorValue: '='
      }
    }

  });
