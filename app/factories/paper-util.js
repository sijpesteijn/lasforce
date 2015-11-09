'use strict';

app.factory('paperUtil', function() {

    function getDiff(point1, point2) {
        var diff = {x:0,y:0};
        diff.x = point2.x - point1.x;
        diff.y = point2.y - point1.y;
        return diff;
    }

    function isSomethingSelected(shape) {
        var something = false;
        if (shape) {
            if (shape.fullySelected) {
                something = true;
            }
            for (var i = 0; i < shape.segments.length; i++) {
                if (shape.segments[i].selected) {
                    something = true;
                }
            }
        }
        return something;
    }

    function getSelectedShapes(shape) {
        var selected = [];
        if (shape) {
            if (shape.fullySelected) {
                selected.push(shape);
            } else {
                for (var i = 0; i < shape.segments.length; i++) {
                    if (shape.segments[i].selected) {
                        selected.push(shape.segments[i]);
                    }
                }
            }
        }
        return selected;
    }

    function moveShape(shape, diff) {
        console.log(diff.x);
        console.log(diff.y);
        if (shape.fullySelected) {
            var newPosition = shape.position;
            newPosition.x = newPosition.x + diff.x;
            if (newPosition.x > 200)
                newPosition.x = 200;
            if (newPosition.x < 0)
                newPosition.x = 0;
            newPosition.y = newPosition.y + diff.y;
            if (newPosition.y > 200)
                newPosition.y = 200;
            if (newPosition.y < 0)
                newPosition.y = 0;
            shape.position = newPosition;
        } else {
            var selectedObjects = getSelectedShapes(shape);
            for(var i = 0;i<selectedObjects.length;i++) {
                var newPosition = selectedObjects[i].point;
                newPosition.x = newPosition.x + diff.x;
                newPosition.y = newPosition.y + diff.y;
                selectedObjects[i].point = newPosition;
            }
        }
    }

    function handleKeyEvent(event, shape) {
        var diff = null;
        switch(event.event.keyCode) {
            case 37: // left
                diff = new Point(-1,0);
                break;
            case 38: // up
                diff = new Point(0,-1);
                break;
            case 39: // right
                diff = new Point(1,0);
                break;
            case 40: // down
                diff = new Point(0,1);
                break;
        }
        if (diff) {
            moveShape(shape, diff);
        }
    }

    function handleMouseDrag(event, shape, start) {
        var diff = getDiff(start, event.point);
        moveShape(shape, diff);
    }

    return {
        getDiff: function(point1, point2) {
            return getDiff(point1, point2);
        },
        isSomethingSelected: function(shape) {
            return isSomethingSelected(shape);
        },
        getSelectedShapes: function(shape) {
            return getSelectedShapes(shape);
        },
        moveShape: function(shape, diff) {
            moveShape(shape, diff);
        },
        handleKeyEvent: function(event, shape) {
            handleKeyEvent(event, shape);
        },
        handleMouseDrag: function(event, shape, start) {
            handleMouseDrag(event, shape, start);
        }
    }
});