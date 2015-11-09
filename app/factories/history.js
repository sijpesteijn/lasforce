'use strict';

app.factory('history', function ($rootScope) {
    var history = [];
    var index = 0;

    var clear = function () {
        history = [];
        index = 0;
        $rootScope.$emit('historyClear');
    };

    var add = function (element) {
        if (index < history.length) {
            history = history.slice(index, history.length);
        }
        index = history.push(element);
        $rootScope.$emit('historyAdd');
    };

    var undo = function () {
        if (index > 0) {
            var element = history[index - 1];
            element.item.remove();
            index--;
            $rootScope.$emit('historyUndo');
        }
    };

    var redo = function () {
        if (index < history.length) {
            var element = history[index++];
            element.parent.add(element.item.point);
            element.item = element.parent.segments[element.parent.segments.length - 1];
            $rootScope.$emit('historyRedo');
        }
    };

    var canUndo = function () {
        return index > 0;
    };

    var canRedo = function () {
        return index < history.length;
    };

    return {
        clear: function () {
            clear();
        },
        add: function (item) {
            add(item);
        },
        undo: function () {
            undo();
        },
        redo: function () {
            redo();
        },
        canUndo: function () {
            return canUndo();
        },
        canRedo: function () {
            return canRedo();
        },
        getHistoryIndex: function () {
            return index;
        }
    }
});
