'use strict';

app.factory('colpick', function() {
  var color;

  function getColor() {
    return color;
  }

  function openColorPick(identifier, color) {
    var cp = $(identifier)
      .colpick({
        colorScheme: 'dark',
        layout: 'hex',
        color: color,
        onSubmit: function (hsb, hex, rgb, el) {
          //$(el).css('background-color', '#' + hex);
          $(el).colpickHide();
          color = hex;
        }
      });

  }

  return {
    openColorPick : function(identifier, color) {
      openColorPick(identifier, color);
    },
    getColor: function() {
      return getColor();
    }
  }
});
