'use strict';

app.factory('toolFactory', function(lineTool,boxTool,moveTool) {
    var tools = [{name:'line',icon:'fa-pencil'},{name:'box',icon:'fa-stop'}, {name:'move',icon:'fa-arrows'}];

    function getTool(name) {
        if (name === 'line') {
            return lineTool;
        } else if (name === 'box') {
            return boxTool;
        } else if (name === 'move') {
            return moveTool;
        }
    }

    function getTools() {
        return tools;
    }

    return {
        getTool: function(name) {
            return getTool(name);
        },
        getTools: function() {
            return getTools();
        }
    }
});