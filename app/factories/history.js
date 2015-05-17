'use strict';

app.factory('history', function() {
  var history = [];
  var index = 0;

  var clear = function() {
    history = [];
  };

  var add = function(item) {
    if (index < history.length) {
      history.slice(index);
    }
    index = history.push(item) - 1;
  };

  var undo = function() {
    if (index > 0) {
      var element = history[index--];
      element.item.remove();
    }
  };

  var redo = function() {
    if (index < history.length) {
      var element = history[++index];
      element.parent.add(element.item.point);
    }
  };

  var canUndo = function() {
    return index > 0;
  };

  var canRedo = function() {
    return index < history.length - 1;
  };

  return {
    clear: function() {
      clear();
    },
    add: function(item) {
      add(item);
    },
    undo: function() {
      undo();
    },
    redo: function() {
      redo();
    },
    canUndo: function() {
      return canUndo();
    },
    canRedo: function() {
      return canRedo();
    },
    getHistoryIndex: function() {
      return index;
    }
  }
});
