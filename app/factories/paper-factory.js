'use strict';

app.factory('paperFactory', function() {

  function createShape(type, startPoint) {
    if (type == 'circle') {
      return new paper.Circle(startPoint, new Size(1, 1));
    }
    if (type == 'rectangle') {
      return new paper.Rectangle(startPoint, new Size(1, 1));
    }
  }

  function createBasicShapeHandler(type) {
    this.drawTool = new Tool();
    this.drawing = false;
    this.shape;
    this.startPoint;
    this.drawTool.onMouseDown = function (e) {
      this.drawing = true;
      this.startPoint = new Point(e.event.offsetX, e.event.offsetY);
      this.shape = createShape(type, this.startPoint);
      this.shape.strokeColor = 'FFFFFF'; //$scope.color;
      this.shape.strokeWidth = 2;
      project.activeLayer.addChild(this.shape);
      paper.view.update();
    }
    this.drawTool.onMouseMove = function (e) {
      if (this.drawing) {
        if (this.startPoint.x != e.event.offsetX && this.startPoint.y != e.event.offsetY) {
          if (this.startPoint.x < e.event.offsetX) {
            this.shape.setLeft(this.startPoint.x);
            this.shape.setRight(e.event.offsetX);
          } else {
            this.shape.setLeft(e.event.offsetX);
            this.shape.setRight(this.startPoint.x);
          }
          if (this.startPoint.y < e.event.offsetY) {
            this.shape.setTop(this.startPoint.y);
            this.shape.setBottom(e.event.offsetY);
          } else {
            this.shape.setTop(e.event.offsetY);
            this.shape.setBottom(this.startPoint.y);
          }
        }
      }
    }
    this.drawTool.onMouseUp = function (e) {
      this.drawing = false;
    }
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
      var toolHandler = new createBasicShapeHandler(type);
      return toolHandler;
    } else if (type === 'path') {
      return createPathHandler();
    } else if (type === 'text') {
      return createTextHandler();
    }
  }


  var createElement = function(element) {
      if (element.type === 'Line') {
        var line = new Path.Line({
          from: [20, 20],
          to: [80, 80],
          strokeColor: 'red'
        });
        return line;
      }
      if (element.type === 'Path') {
        var path = new paper.Path();
        path.segments = element.segments;
        path.strokeColor = element.strokeColor;
        path.strokeWidth = element.strokeWidth;
        path.closed = element.closed;
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
