'use strict';

app.factory('paperFactory', function() {

  function createShape(shape, startPoint) {
    if (shape == 'circle') {
      return new paper.Path.Circle(startPoint, new Size(1, 1));
    }
    if (shape == 'rectangle') {
      return new paper.Path.Rectangle(startPoint, new Size(1, 1));
    }
  }

  function createBasicShapeHandler() {
    var drawTool = new Tool();
    var drawing = false;
    var shape;
    var startPoint;
    drawTool.activate();
    drawTool.onMouseDown = function (e) {
      drawing = true;
      startPoint = new Point(e.event.offsetX, e.event.offsetY);
      shape = createShape(type, startPoint);
      shape.strokeColor = $scope.color;
      shape.strokeWidth = 2;
      project.activeLayer.addChild(shape);
      paper.view.draw();
    }
    drawTool.onMouseMove = function (e) {
      if (drawing) {
        if (startPoint.x != e.event.offsetX && startPoint.y != e.event.offsetY) {
          if (startPoint.x < e.event.offsetX) {
            shape.bounds.left = startPoint.x;
            shape.bounds.right = e.event.offsetX;
          } else {
            shape.bounds.left = e.event.offsetX;
            shape.bounds.right = startPoint.x;
          }
          if (startPoint.y < e.event.offsetY) {
            shape.bounds.top = startPoint.y;
            shape.bounds.bottom = e.event.offsetY;
          } else {
            shape.bounds.top = e.event.offsetY;
            shape.bounds.bottom = startPoint.y;
          }
          paper.view.draw();
        }
      }
    }
    drawTool.onMouseUp = function (e) {
      drawing = false;
      paper.view.draw();
    }
    return drawTool;
  }

  function createPathHandler() {
    var drawTool = new Tool();
    var drawing = false;
    var path;
    var startPoint;
    var nextPoint;
    var line;
    drawTool.activate();
    drawTool.onMouseDown = function (e) {
      if (e.event.button == 2) {
        e.preventDefault();
        drawing = false;
        line.remove();
      } else {
        if (drawing == false) {
          path = new paper.Path();
          path.add(e.point);
          path.strokeColor = color;
          path.strokeWidth = Settings.strokeWidth;
          nextPoint = new Point(e.event.offsetX + 1, e.event.offsetY + 1);
          line = new Path.Line(e.point, nextPoint);
          line.strokeColor = 'white';
          line.strokeWidth = Settings.strokeWidth;
          line.dashArray = [10, 12];
          drawing = true;
        } else {
          path.add(e.point);
          line.remove();
          nextPoint = new Point(e.event.offsetX + 1, e.event.offsetY + 1);
          line = new Path.Line(e.point, nextPoint);
          line.strokeColor = 'white';
          line.strokeWidth = Settings.strokeWidth;
          line.dashArray = [10, 12];
        }
      }
    }
    drawTool.onMouseMove = function (e) {
      if (drawing == true) {
        line.segments[1].point = e.point;
        console.log(nextPoint);
      }
    }
    return drawTool;
  }

  function createTextHandler() {
    var textTool = new Tool();
    textTool.activate();
    var group = new Group();
    var flash;
    var rectangle;
    var text;
    var textCursor;
    textTool.onMouseDown = function (e) {
      if (rectangle != undefined) {
        if (!rectangle.contains(e.point)) {
          rectangle.remove();
          textCursor.remove();
          clearInterval(flash);
        } else {
          rectangle.remove();
          clearInterval(flash);
        }
        return;
      }
      rectangle = new Path.Rectangle(e.point, new Point(e.event.offsetX + 20, e.event.offsetY + 30));
      rectangle.strokeColor = 'white';
      rectangle.strokeWidth = 3;
      rectangle.dashArray = [10, 12];
      text = new paper.PointText({
        point: [e.event.offsetX + 5, e.event.offsetY + 28],
        content: '',
        fillColor: color,
        font: "Comfortaa",
        fontWeight: "bold",
        fontSize: 30
      });
      textCursor = new paper.PointText({
        point: [text.position.x, text.position.y],
        content: '_',
        fillColor: color,
        font: "Comfortaa",
        fontWeight: "bold",
        fontSize: 30
      });
      group.addChild(rectangle);
      group.addChild(text);
      group.addChild(textCursor);
      flash = setInterval(function () {
        if (textCursor.visible == true) {
          textCursor.visible = false;
        } else {
          textCursor.visible = true;
        }
        paper.view.draw();
      }, 500);
    }
    textTool.onKeyDown = function(e) {
      console.log(e.character);
      if (e.character != '') {
        text.content = text.content + e.key;
        textCursor.position.x = text.bounds.right;
        rectangle.bounds.right = text.bounds.right + 5;
      }
    }
    return textTool;
  }

  var createToolHandler = function(type) {
    console.log(type + ' drawTool selected.');
    if (type === 'rectangle' || type === 'circle') {
      return createBasicShapeHandler();
    } else if (type === 'path') {
      return createPathHandler();
    } else if (type === 'text') {
      return createTextHandler();
    }
  }


  var createElement = function(element) {
      if (element.type === 'Path') {
        var path = new paper.Path();
        path.segments = element.segments;
        path.strokeColor = element.strokeColor;
        path.strokeWidth = element.strokeWidth;
        path.closed = element.closed;
        //path.fitBounds(viewWindow);
        //path.scale(0.04);
        return path;
      }
      if (element.type === 'Group') {
        var group = new paper.Group();
        group.applyMatrix = child.applyMatrix;
        var children = [];
        angular.forEach(element.children, function (child) {
          children.push(createPaperElement(child));
        });
        group.children = children;
        return group;
      }
      if (element.type === 'PointText') {
        var pointText = new paper.PointText();
        pointText.applyMatrix = element.applyMatrix;
        pointText.content = element.content;
        pointText.fillColor = element.fillColor;
        pointText.font = element.font;
        pointText.fontFamily = element.fontFamily;
        pointText.fontSize = element.fontSize;
        pointText.fontWeight = element.fontWeight;
        pointText.leading = element.leading;
        pointText.matrix = element.matrix;
        return pointText;
      }

  }

  return {
    createElement: function(element) {
      return createElement(element);
    },
    createToolHandler: function(type) {
      return createToolHandler(type);
    }
  }
});
