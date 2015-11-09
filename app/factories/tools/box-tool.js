'use strict';

app.factory('boxTool', function (history, paperUtil) {
    var tool, objectListener, color, drawing = false, rectangle, startPoint;

    function init(_objectListener_, _color_) {
        tool = new paper.Tool();
        tool.onMouseDown = mouseDown;
        tool.onMouseMove = mouseMove;
        tool.onMouseUp = mouseUp;
        tool.activate();
        objectListener = _objectListener_;
        color = _color_;
    }

    function addToHistory(parent, item) {
        var element = {
            type: 'rectangle',
            parent: parent,
            item: item
        };
        history.add(element);
    }

    function mouseDown(event) {
        if (drawing == false) {
            startPoint = new paper.Point(event.point.x, event.point.y);
            if (!paperUtil.isSomethingSelected(rectangle)) {
                var bottomRight = new paper.Point(event.point.x + 10, event.point.y + 10);
                rectangle = new paper.Path.Rectangle(startPoint, bottomRight);
                rectangle.name = 'Rectangle_' + rectangle.index;
                rectangle.strokeColor = color;
                rectangle.strokeWidth = 2;
                rectangle.dashArray = [10, 12];
                paper.view.draw();
                drawing = true;
            }
        }
    }

    function mouseMove(event) {
        if (paperUtil.isSomethingSelected(rectangle)) {
            if (startPoint) {
                paperUtil.moveShape(rectangle, paperUtil.getDiff(startPoint, event.point));
            }
        } else if (drawing) {
            rectangle.segments[0].point.y = event.point.y;
            rectangle.segments[2].point.x = event.point.x;
            rectangle.segments[3].point = event.point;
            //rectangle.bounds.width = event.point.x;
            //rectangle.bounds.height = event.point.y;
            rectangle.segments[0].point.name = 'Left bottom';
            rectangle.segments[1].point.name = 'Left top';
            rectangle.segments[2].point.name = 'Right top';
            rectangle.segments[3].point.name = 'Right bottom';
        }
        paper.view.draw();
    }

    function mouseUp(event) {
        if (drawing) {
            rectangle.dashArray = undefined;
            addToHistory(rectangle);
            drawing = false;
            paper.view.draw();
            objectListener(rectangle);
            startPoint = null;
        }
    }

    function colorChange(newColor) {
        color = newColor;
        rectangle.strokeColor = newColor;
        paper.view.draw();
    }

    function newFrame() {
        if (rectangle)
            rectangle.fullySelected = false;
    }

    function deleteObjects() {
        if (paperUtil.isSomethingSelected(rectangle)) {
            var selected = paperUtil.getSelectedShapes(rectangle);
            for(var i=0;i<selected.length;i++) {
                selected[i].remove();
            }
        }
    }

    function destroy() {
        tool.remove();
    }

    return {
        init: function(objectListener, color) {
            init(objectListener, color);
        },
        onMouseDown: function(event) {
            mouseDown(event);
        },
        onMouseMove: function(event) {
            mouseMove(event);
        },
        onMouseUp: function(event) {
            mouseUp(event);
        },
        onColorChange: function(newColor) {
            colorChange(newColor);
        },
        onNewFrame: function() {
            newFrame();
        },
        onDestroy: function() {
            destroy();
        },
        onDeleteObjects: function() {
            deleteObjects();
        },
        name: 'box'
    }
});