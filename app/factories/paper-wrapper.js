'use strict';

app.factory('paperWrapper', function () {
    var initialized = false;

    function setup(identifier) {
        initialized = false;
        //if (paper.projects.length > 0) {
        //    paper.project.
        //    paper.project.clear();
        //}
        paper.install(window);
        paper.setup(identifier);
        paper.settings.handleSize = 8;
        initialized = true;
    }

    function setZoom(zoom) {
        paper.view.zoom = zoom;
        paper.view.update();
    }

    function isInitialized() {
        return initialized;
    }

    function updateView() {
        paper.view.update();
    }

    function getLayers() {
        return project.layers;
    }

    function removeLayer(id) {
        project.layers.splice(id, 1);
    }

    function showLayer(id) {
        if (angular.isDefined(project.layers[id])) {
            project.layers[id].visible = true;
            project._activeLayer = project.layers[id];
            updateView();
        }
    }

    function hideLayer(id) {
        if (angular.isDefined(project.layers[id])) {
            project.layers[id].visible = false;
            updateView();
        }
    }

    function broadCast(progress) {
        $('div.progress-bar').attr('aria-valuenow', progress);
        $('div.progress-bar').css('width', progress + '%');
        angular.element($('div.progress-bar')).html(progress + '% Complete');
        if (progress === 100) {
            angular.element($('div.progress')).addClass('ng-hide');
            //angular.element($('div.progress-bar')).addClass('ng-hide');
        }
    }

    function loadAnimation(animation) {
        if (animation.frames === undefined || animation.frames.length === 0) {
            throwError('LA_01', {status: 666, statusText: 'No frames in this animation!!'});
        }
        var frameStep = Math.round(1000 / animation.frames.length);
        var progress = 1000 - (frameStep * animation.frames.length);
        $('div.progress').removeClass('ng-hide');
        //$('div.progress-bar').removeClass('ng-hide');
        angular.forEach(animation.frames, function (frame) {
            var pFrame = new paper.Layer([]);
            pFrame.name = frame.name;
            pFrame.lasforceId = frame.id;
            pFrame.applyMatrix = frame.applyMatrix;
            frame.paperObject = pFrame;
            if (frame.shapes.length === 0) {
                progress += frameStep;
                broadCast(Math.round(progress / 10));
            } else {
                var shapeStep = Math.round(frameStep / frame.shapes.length);
                progress += frameStep - (shapeStep * frame.shapes.length);
                angular.forEach(frame.shapes, function (shape) {
                    var paperObject = createPaperObject(shape);
                    shape.paperObject = paperObject;
                    pFrame.addChild(paperObject);
                    progress += shapeStep;
                    broadCast(Math.round(progress / 10));
                });
            }
            pFrame.visible = false;
        });
    }

    var createPaperObject = function (paperObjectMetaData) {
        if (paperObjectMetaData.type === 'line') {
            var line = new Path.Line({
                id: paperObjectMetaData.id,
                name: paperObjectMetaData.name,
                type: 'Path',
                from: [0, 0],
                to: [8000, 8000],
                strokeColor: 'red',
                strokeWidth: 5
            });
            return line;
        }
        if (paperObjectMetaData.type === 'path') {
            var path = new paper.Path();
            paperObjectMetaData.id = path.id;
            path.name = paperObjectMetaData.name;
            path.type = 'Path';
            var color = new Color(paperObjectMetaData.strokeColor.red, paperObjectMetaData.strokeColor.green, paperObjectMetaData.strokeColor.blue);
            path.strokeColor = color;
            path.selectedColor = 'red';
            path.strokeWidth = 400; //paperObjectMetaData.strokeWidth;
            angular.forEach(paperObjectMetaData.segments, function (segment) {
                var point = new Segment(segment.point.x, segment.point.y);
                segment.id = point.id;
                segment.paperObject = point;
                point.name = segment.point.name;
                path.add(point);
            });
            path.closed = paperObjectMetaData.closed;
            return path;
        }
        if (paperObjectMetaData.type === 'point') {
            var point = new Path.Circle(new Point(paperObjectMetaData.x, paperObjectMetaData.y), 400);
            var color = new Color(paperObjectMetaData.strokeColor.red, paperObjectMetaData.strokeColor.green, paperObjectMetaData.strokeColor.blue);
            point.fillColor = color;
            point.selectedColor = 'red';
            point.strokeWidth = 400;
            console.log('');
        }
        if (paperObjectMetaData.type === 'group') {
            var group = new paper.Group();
            group.applyMatrix = child.applyMatrix;
            var children = [];
            angular.forEach(paperObjectMetaData.children, function (child) {
                children.push(createPaperElement(child));
            });
            group.children = children;
            return group;
        }
        if (paperObjectMetaData.type === 'pointText') {
            var pointText = new paper.PointText();
            pointText.applyMatrix = paperObjectMetaData.applyMatrix;
            pointText.content = paperObjectMetaData.content;
            pointText.fillColor = paperObjectMetaData.fillColor;
            pointText.font = paperObjectMetaData.font;
            pointText.fontFamily = paperObjectMetaData.fontFamily;
            pointText.fontSize = paperObjectMetaData.fontSize;
            pointText.fontWeight = paperObjectMetaData.fontWeight;
            pointText.leading = paperObjectMetaData.leading;
            pointText.matrix = paperObjectMetaData.matrix;
            return pointText;
        }

    };

    var getPaperObjectMetaData = function (paperObject) {
        var metadata = {
            type: paperObject.type,
            name: paperObject.name
        };
        if (paperObject.type === 'Path') {
            var segments = [];
            angular.forEach(paperObject.segments, function (segment) {
                segments.push({
                    point: {
                        x: segment.point.x,
                        y: segment.point.y,
                        name: segment.name
                    }
                });
            });
            metadata.segments = segments;
        }
        return metadata;
    };

    var getObjectTree = function () {
        var frames = [], index = 0;
        angular.forEach(project.layers, function (layer) {
            var children = [];
            angular.forEach(layer.children, function (child) {
                var type = child.toJSON()[0];
                if (type === 'Path') {
                    var segments = [];
                    angular.forEach(child.segments, function (segment) {
                        var segmentObj = {
                            type: 'segment',
                            point: {
                                type: 'point',
                                name: segment.point.name,
                                x: segment.point.x,
                                y: segment.point.y
                            }
                        };
                        segments.push(segmentObj);
                    });
                    var childObj = {
                        type: 'path',
                        id: child.id,
                        name: child.name,
                        applyMatrix: child.applyMatrix,
                        strokeWidth: child.strokeWidth,
                        strokeColor: {
                            blue: child.strokeColor.blue,
                            green: child.strokeColor.green,
                            red: child.strokeColor.red
                        },
                        closed: child.closed,
                        segments: segments
                    };
                    children.push(childObj);
                }
            });
            var frameObj = {
                name: layer.name,
                id: index++,
                applyMatrix: layer.applyMatrix,
                shapes: children
            };
            frames.push(frameObj);
        });
        return frames;
    };

    function getSelectedChildren(segments) {
        var selected = [];
        angular.forEach(segments, function(segment) {
           if (segment.selected) {
               selected.push(segment);
           }
        });
        return selected;
    }

    var toggleSelectPaperObject = function (paperObjectMetaData, select) {
        paperObjectMetaData.selected = select;
        if (paperObjectMetaData.type === 'Path') {
            //var selectedChildren = getSelectedChildren(paperObjectMetaData.paperObject.segments);
            paperObjectMetaData.paperObject.fullySelected = select;
            //if (!select && selectedChildren.length > 0) {
            //    angular.forEach(selectedChildren, function(child) {
            //       child.selected = true;
            //    });
            //}
        } else {
            paperObjectMetaData.paperObject.selected = select;
            if (!select && angular.isDefined(paperObjectMetaData.parent)) {
                toggleSelectPaperObject(paperObjectMetaData.parent.paperObjectMetaData, select);
            }
        }
        updateView();
    };

    return {
        setup: function (identifier) {
            setup(identifier);
        },
        setZoom: function (zoom) {
            setZoom(zoom);
        },
        isInitialized: isInitialized,
        clearProject: function() {
            project.clear();
            updateView();
        },
        getLayers: function () {
            return getLayers();
        },
        getActiveLayer: function () {
            return project.activeLayer;
        },
        showLayer: function (id) {
            showLayer(id);
        },
        hideLayer: function (id) {
            hideLayer(id);
        },
        removeLayer: function (id) {
            removeLayer(id);
        },
        newLayer: function () {
            new paper.Layer();
        },
        updateView: function () {
            updateView();
        },
        createPaperObject: function (paperObjectMetaData) {
            return createPaperObject(paperObjectMetaData);
        },
        selectPaperObject: function (paperObjectMetaData) {
            return toggleSelectPaperObject(paperObjectMetaData, true);
        },
        deselectPaperObject: function (paperObjectMetaData) {
            return toggleSelectPaperObject(paperObjectMetaData, false);
        },
        getPaperObjectMetaData: function (paperObject) {
            return getPaperObjectMetaData(paperObject);
        },
        getObjectTree: getObjectTree,
        loadAnimation: function (animation) {
            loadAnimation(animation);
        }
    }
});
