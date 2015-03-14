app.controller('drawCtrl', function ($scope, $rootScope, $http, $modal, $i18next, settings) {
    paper.install(window);
    paper.setup('CanvasDraw');

    var color = '#0f58f5';
    $scope.name = $i18next('DRAW.NAME');
    $scope.selectedTool = "";
    $scope.frames = new Array();
    project.activeLayer.name = $i18next('DRAW.NEW_FRAME') + ' 1';
    $scope.frames[0] = project.activeLayer;

    $scope.drawRectangle = function () {
        $scope.selectedTool = 'rectangle';
        new DrawHandler('Rectangle');
    }

    $scope.drawText = function () {
        $scope.selectedTool = 'text';
        console.log('Text draw tool selected');
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
    }

    $scope.drawCircle = function () {
        $scope.selectedTool = 'circle';
        new DrawHandler('Circle');
    }

    $scope.drawPath = function () {
        $scope.selectedTool = 'path';
        console.log('path drawTool selected.');
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
    }

    function DrawHandler(type) {
        console.log(type + ' drawTool selected.');
        var drawTool = new Tool();
        var drawing = false;
        var shape;
        var startPoint;
        drawTool.activate();
        drawTool.onMouseDown = function (e) {
            drawing = true;
            startPoint = new Point(e.event.offsetX, e.event.offsetY);
            shape = createShape(type, startPoint);
            shape.strokeColor = color;
            shape.strokeWidth = Settings.strokeWidth;
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
                }
            }
        }
        drawTool.onMouseUp = function (e) {
            drawing = false;
        }
    }

    $scope.selectShape = function () {
        $scope.selectedTool = 'select';
        var lastKey = '';
        var selectTool = new Tool();
        selectTool.activate();
        console.log('Select tool selected.');
        selectTool.onMouseDown = function (e) {
            console.log('Down');
            var children = project.activeLayer.children;
            for (var i = 0; i < children.length; i++) {
                if (children[i].contains(e.point)) {
                    var child = children[i];
                    child.fullySelected = true;
                    child.onKeyDown = function (e) {
                        console.log(e.key);
                    }
                    child.onMouseOver = function () {
                        console.log('Over');
                    }
                }
            }
        }
        selectTool.onKeyDown = function (e) {
            console.log('Key down event: ' + e.key);
            if (e.key == 'd' || (lastKey == 'control' && e.key == 'backspace')) {
                var children = project.activeLayer.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].selected) {
                        children[i].remove();
                    }
                }
            }
            lastKey = e.key;
        }
        selectTool.onKeyUp = function (e) {
            lastKey = '';
        }
    }

    $scope.save = function () {
        $scope.selectedTool = 'save';
        var json = '{"name":"' + $scope.name + '", "layers":'+project.exportJSON() +'}';
        console.log('MyJson: ' + json);
        $http.post(settings.get('rest.templ.animationSave'), json).
            success(function (data) {
                $scope.saved = true;
            });
    }

    function createShape(shape, startPoint) {
        if (shape == 'Circle') {
            return new paper.Path.Circle(startPoint, new Size(1, 1));
        }
        if (shape == 'Rectangle') {
            return new paper.Path.Rectangle(startPoint, new Size(1, 1));
        }
    }

    var newFrameCtrl = function ($scope, $modalInstance) {
        $scope.clone = true;
        $scope.frameName = $i18next('DRAW.NEW_FRAME') + ' ' + (project.layers.length + 1);
        $scope.ok = function () {
            var parentChildren = project.activeLayer.children;
            project.activeLayer.visible = false;
            paper.view.draw();
            var newLayer = new Layer();
            if (this.clone) {
                var length = parentChildren.length;
                for (var i = 0; i < length; i++) {
                    newLayer.addChild(parentChildren[i].clone());
                }
            }
            newLayer.name = this.frameName;
            $modalInstance.close(newLayer);
        };
        $scope.cancel = function () {
            $modalInstance.close();
        }
    };

    $scope.newFrame = function () {
        $scope.selectedTool = 'new frame';
        var newFrameModal = $modal.open({
            templateUrl: "./views/newFrame.html",
            controller: newFrameCtrl
        });
        newFrameModal.result.then(function (newFrame) {
            if (newFrame != undefined) {
                $scope.frames[project.layers.length - 1] = newFrame;
                $rootScope.currentFrameName = project.activeLayer.name;
            }
        });
    }

});
