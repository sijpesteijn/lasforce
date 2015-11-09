'use strict';

app.factory('lineTool', function (history, paperUtil) {
    var tool, drawing = false, nextPoint, line, path, color, objectListener, selectStart;

    function init(_objectListener_, _color_) {
        tool = new paper.Tool();
        tool.onMouseDown = mouseDown;
        tool.onMouseMove = mouseMove;
        tool.onMouseDrag = function(event) {
            if (paperUtil.isSomethingSelected(path) && selectStart) {
                paperUtil.handleMouseDrag(event, path, selectStart);
            }
        };
        tool.onKeyDown = function(event) {
            if (paperUtil.isSomethingSelected(path)) {
                paperUtil.handleKeyEvent(event, path);
            }
        };
        tool.activate();
        objectListener = _objectListener_;
        color = _color_;
    }

    function addToHistory(parent, item) {
        var element = {
            type: 'path',
            parent: parent,
            item: item
        };
        history.add(element);
    }

    function drawHelperLine(event) {
        if (line)
            line.remove();
        nextPoint = new paper.Point(event.point.x + 1, event.point.y + 1);
        nextPoint.name = 'Point';
        line = new Path.Line(new paper.Point(event.point.x, event.point.y), nextPoint);
        line.strokeColor = color;
        line.strokeWidth = 400;
        line.dashArray = [3000, 1000];
    }

    function mouseDown(event) {
        if (event.event.button == 0) {
            if (paperUtil.isSomethingSelected(path)) {
                selectStart = event.point;
            } else {
                var point = new paper.Point(event.point.x, event.point.y);
                if (drawing == false) {
                    path = new paper.Path();
                    path.selectedColor = 'red';
                    path.name = 'Path_' + path.index;
                    path.type = 'Path';
                    path.strokeColor = color;
                    path.strokeWidth = 400;
                    addToHistory(path);
                    path.add(point);
                    path.segments[path.segments.length-1].point.name = 'Point_' + (path.segments.length-1);
                    addToHistory(path, point);
                    drawHelperLine(event);
                    drawing = true;
                } else {
                    path.add(point);
                    path.segments[path.segments.length-1].point.name = 'Point_' + (path.segments.length-1);
                    addToHistory(path, point);
                    drawHelperLine(event);
                }
            }
        } else if(event.event.button == 2) {
            event.preventDefault();
            line.remove();
            drawing = false;
            if (path.segments.length === 1) {
                path.remove();
            } else {
                objectListener(path);
            }
        }
        paper.view.draw();
    }

    function mouseMove(event) {
        if (!paperUtil.isSomethingSelected(path) && drawing == true) {
            line.segments[1].point = event.point;
        }
        paper.view.draw();
    }

    function colorChange(newColor) {
        color = newColor;
        if (path) {
            if (paperUtil.isSomethingSelected(path)) {
                path.strokeColor = newColor;
            } else if (drawing) {
                line.strokeColor = newColor;
                path.strokeColor = newColor;
            }
            paper.view.draw();
        }
    }

    function newFrame() {
        if (path)
            path.fullySelected = false;
    }

    function deleteObjects() {
        if (paperUtil.isSomethingSelected(path)) {
            var selected = paperUtil.getSelectedShapes(path);
            for(var i=0;i<selected.length;i++) {
                selected[i].remove();
            }
        }
    }

    function destroy() {
        tool.remove();
    }

    return {
        init: function (objectListener, color) {
            init(objectListener, color);
        },
        onMouseDown: function (event) {
            mouseDown(event);
        },
        onMouseMove: function(event) {
            mouseMove(event);
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
        name: 'line'
    }
});