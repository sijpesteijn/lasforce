'use strict';

app.controller('colorpickerCtrl', function ($scope, $rootScope) {

  $('.color-box').colpick({
    colorScheme: 'dark',
    layout: 'rgbhex',
    color: '0f58f5',
    onSubmit: function (hsb, hex, rgb, el) {
      $(el).css('background-color', '#' + hex);
      $(el).colpickHide();
      color = '#' + hex;
    }
  }).css('background-color', '#0f58f5');

})
  .directive('colorpicker', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/directives/colorPicker/colorpicker.html',
      controller: 'colorpickerCtrl',
      scope: {
      }
    }

  });
