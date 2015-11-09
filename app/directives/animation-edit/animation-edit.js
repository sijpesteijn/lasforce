'use strict';

app.controller('animationEditCtrl', function ($scope, $rootScope, $i18next, $resource, $interval, $location, history, settings) {
    paper.install(window);
    paper.setup('animationEditCanvas');
    var walkerInterval, currentLayer, toolInUse;
    var layerElements = [];
    $scope.frameIndex = 0;
    $scope.playing = false;
    $scope.newFrameCopyChildren = true;
    $scope.loop = true;

    function init() {

        //project.clear();
        //toolInUse = null;
        //history.clear();
        //if (!angular.isDefined($scope.zoom)) {
        //    $scope.zoom = 1;
        //}
        //paper.view.zoom = $scope.zoom;
        //var params = $location.search();
        //if (angular.isDefined(params.animationId) && !isNaN(params.animationId)) {
        //    var animationId = params.animationId;
        //    $resource(settings.get('rest.templ.animation-load-ilda')).get(
        //        {id: animationId},
        //        function (data) {
        //            $scope.animation = {
        //                id: data.metaData.id,
        //                name: data.metaData.name,
        //                framerate: data.metaData.frameRate,
        //                totalFrames: data.metaData.totalFrames,
        //                loopCount: data.metaData.loopCount
        //            };
        //            angular.forEach(data.layers, function (frame) {
        //                $scope.addFrame(frame);
        //            });
        //            $scope.current_frame_id = 0;
        //            project.layers[$scope.current_frame_id].visible = true;
        //            paper.view.update();
        //        },
        //        function (error) {
        //            throwError('A002', error, status);
        //        });
        //} else {
        //    $scope.addFrame();
        //    $scope.animation.totalFrames = 1;
        //    project.layers[$scope.current_frame_id].visible = true;
        //    paper.view.update();
        //}
        //$scope.layerElements = project.activeLayer.children;
    }

    function lineTool(objectListener) {
        this.tool = new Tool();
        this.tool.fixedDistance = 50;
        this.drawing = false;
        this.nextPoint;
        this.line;
        this.path;
        this.selectedPoint;
        this.color = $scope.selectedColor;
        this.tool.activate();
        var that = this;
        this.addToHistory = function (parent, item) {
            var item = {
                type: 'path',
                parent: parent,
                item: item
            };
            history.add(item);
        };
        this.tool.onMouseDown = function (event) {
            if (event.event.button == 2) {
                event.preventDefault();
                that.drawing = false;
                that.line.remove();
                objectListener(that.path);
            } else {
                if (that.drawing == false) {
                    if (that.path) {
                        if (that.path.fullySelected) {
                            for (var i = 0; i < that.path.segments; i++) {
                                if (Math.abs(that.path.segments[i].point.x - event.point.x) < 10 && Math.abs(that.path.segments[i].point.y - event.point.y) < 10) {
                                    that.selectedPoint = i;
                                }
                            }
                        }
                        if (!that.selectedPoint)
                            that.path.fullySelected = false;
                    }
                    if (!that.selectedPoint) {
                        that.path = new Path();
                        that.path.name = 'Path';
                        that.addToHistory(that.path);
                        var point = event.point;
                        that.path.add(point);
                        that.addToHistory(that.path, that.path.segments[0]);
                        that.path.strokeColor = that.color;
                        that.path.strokeWidth = 2;
                        that.nextPoint = new Point(event.event.offsetX + 1, event.event.offsetY + 1);
                        that.nextPoint.name = 'Point';
                        that.line = new Path.Line(event.point, that.nextPoint);
                        that.line.strokeColor = that.color;
                        that.line.strokeWidth = 2;
                        that.line.dashArray = [10, 12];
                        that.drawing = true;
                        $scope.$apply();
                    }
                } else {
                    var point = event.point;
                    that.path.add(point);
                    that.addToHistory(that.path, that.path.segments[that.path.segments.length - 1]);
                    that.line.remove();
                    that.nextPoint = new Point(event.event.offsetX + 1, event.event.offsetY + 1);
                    that.nextPoint.name = 'Point';
                    that.line = new Path.Line(event.point, that.nextPoint);
                    that.line.strokeColor = that.color;
                    that.line.strokeWidth = 2;
                    that.line.dashArray = [10, 12];
                    $scope.$apply();
                }
            }
        };
        this.tool.onMouseMove = function (event) {
            if (that.drawing == true) {
                that.line.segments[1].point = event.point;
            } else {
                if (that.selectedPoint) {
                    that.path.segments[that.selectedPoint].point = event.point;
                }
            }
        };
        this.tool.onMouseUp = function (event) {
            if (angular.isDefined(that.selectedPoint))
                that.selectedPoint = null;
        };
        this.onColorChange = function (newColor) {
            this.color = newColor;
            this.line.strokeColor = newColor;
            if (this.drawing) {
                this.path = new Path();
                this.path.name = 'Path';
                this.path.add(this.line.segments[0].point);
                this.path.strokeColor = newColor;
                this.path.strokeWidth = 2;
            }
        };
        this.onNewFrame = function () {
            that.path.fullySelected = false;
        };
        this.onDestroy = function () {

        };
    }

    function pathTool() {
        this.tool = new Tool();
        this.color = $scope.selectedColor;
        var that = this;
        this.tool.onMouseDown = function (event) {
            that.shape = new Path();
            that.shape.strokeColor = that.color;
            that.shape.strokeWidth = 2;
            that.shape.add(event.point);
        };

        this.tool.onMouseDrag = function (event) {
            that.shape.add(event.point);
        };
        this.onColorChange = function (newColor) {
            this.color = newColor;
        }
    }

    $scope.$watchCollection('animation.frames[current_frame_id].shapes', function() {
        console.log('Shape');
    }, true);

    //$scope.$watch('current_tool', function (newValue) {
    //    if (angular.isDefined(newValue)) {
    //        toolInUse = null;
    //        if (newValue === 'line') {
    //            toolInUse = new lineTool(function (paperObj) {
    //                $scope.animation.frames[$scope.current_frame_id].shapes.push(paperObj);
    //                layerElements.push(paperObj);
    //                $scope.newElements = layerElements.length;
    //                $scope.$apply();
    //            });
    //        }
    //        if (newValue === 'circle') {
    //            toolInUse = new circleTool();
    //        }
    //        if (newValue === 'path') {
    //            toolInUse = new pathTool();
    //        }
    //    }
    //});

    //$scope.$watch('animation', function (newValue) {
    //    if ($scope.playing) {
    //        $interval.cancel(walkerInterval);
    //        walkerInterval = $interval(function () {
    //            $scope.forward();
    //        }, getFrameTime());
    //    }
    //}, true);

    $scope.$watch('selectedColor', function (selectedColor) {
        console.log('COLOR: ' + selectedColor);
        $scope.selectedColor = selectedColor;

        if (toolInUse) {
            toolInUse.onColorChange(selectedColor);
        }
    }, true);

    function getFrameTime() {
        return (1 / $scope.animation.framerate) * $scope.animation.totalFrames * 1000;
    }

    $scope.$on('historyUndo', function () {
        paper.view.update();
    });

    $scope.getHistoryIndex = function () {
        return history.getHistoryIndex();
    };

    $scope.$on('historyRedo',function () {
        paper.view.update();
    });

    $scope.save = function () {
        var lasforceAnimation = {
            metadata: $scope.animation,
            //layers: paperFactory.getObjectTree()
        };
        $resource(settings.get('rest.templ.animationSave')).save(
            null,
            lasforceAnimation,
            function (data) {
                console.log('Saved: ' + data);
                $.infoBox({
                    title: "Animation saved",
                    content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                    color: "#296191",
                    iconInfo: "fa fa-thumbs-up bounce animated",
                    timeout: 3000
                });

            },
            function (error, status) {
                throwError('A003', error, status);
            });

    };



    //$scope.$watch('current_frame_id', function (frame_id) {
    //    $scope.setCurrentFrame(frame_id);
    //}, true);

    $scope.setCurrentFrame = function () {
        // TODO hide all layers
        //project.layers[$scope.current_frame_id].visible = false;
        project.layers[$scope.current_frame_id].visible = true;
        paper.view.update();
    };

    $scope.zoomIn = function () {
        $scope.zoom = Math.round(($scope.zoom + 0.1) * 10) / 10;
        paper.view.zoom = $scope.zoom;
        paper.view.update();
    };

    $scope.zoomOut = function () {
        if ($scope.zoom > 0.1) {
            $scope.zoom = Math.round(($scope.zoom - 0.1) * 10) / 10;
            paper.view.zoom = $scope.zoom;
            paper.view.update();
        }
    };

    $scope.addFrame = function (layer) {
        var children;

        if (toolInUse) {
            toolInUse.onNewFrame();
        }

        $scope.layerElements = [];
        if (project.layers.length > 0)
            children = project.activeLayer.children;

        if (project.layers.length > $scope.current_frame_id)
            project.layers[$scope.current_frame_id].visible = false;

        currentLayer = new Layer();
        if ($scope.newFrameCopyChildren && project.layers.length > 1) {
            angular.forEach(children, function (child) {
                project.activeLayer.addChild(child.clone());
            });
            paper.view.update();
        }
        var newName = $i18next('DRAW.NEW_FRAME') + ' ' + $scope.frameIndex;
        var frame = {
            index: $scope.frameIndex++,
            name: angular.isDefined(layer) ? layer.name : newName,
            edit: false,
            shapes: []
        };
        currentLayer.name = frame.name;
        currentLayer.visible = true;
        if (angular.isDefined(layer)) {
            angular.forEach(layer.children, function (element) {
                //var paperObj = paperFactory.createElement(element);
                currentLayer.addChild(paperObj);
                layerElements.push(paperObj);
                $scope.newElements = layerElements.length;
            });
        }
        //$scope.layerElements.push(currentLayer);
        //currentLayer.activate();
        $scope.animation.frames.push(frame);
        $scope.current_frame_id = frame.index;
        scrollCurrentFrameIntoView();
    };

    $scope.removeFrame = function (id) {
        if ($scope.frames.length > 1) {
            if ($scope.current_frame_id == id) {
                $scope.backward();
            }
            var index = 0;
            angular.forEach($scope.frames, function (frame) {
                if (frame.index == id) {
                    $scope.frames.splice(index, 1);
                    project.layers.splice(index, 1);
                    paper.view.update();
                }
                index++;
            });
            if ($scope.current_frame_id > $scope.frames.length - 1) {
                $scope.current_frame_id = $scope.frames.length - 1;
            }
            $scope.animation.totalFrames = $scope.frames.length;
        }
    };

    $scope.getLayerElements = function () {
        return layerElements;
    };
    init();
});

app.directive('animationEdit', function () {
    return {
        templateUrl: '/directives/animation-edit/animation-edit.html',
        controller: 'animationEditCtrl',
        replace: true,
        restrict: 'E'
    }
});
