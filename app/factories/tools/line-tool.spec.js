'use strict';

describe('Line tool factory', function () {
    var tool, $document;

    beforeEach(function () {
        setup();
        inject(function (_$document_, _lineTool_) {
            $document = _$document_;
            tool = _lineTool_;
        });
        var body = $document.find('body');
        var canvas = body.find('#paperCanvas');
        if (canvas.length === 0) {
            angular.element(document.body).append('<canvas id="paperCanvas" style="background-color: black;width: 200px;height: 200px;" ></canvas>');
            paper.install(window);
            paper.setup(document.getElementById('paperCanvas'));
        }
        paper.project.clear();
    });

    describe('the factory', function () {

        it('should allow me to draw a line', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            expect(pObj).toBeDefined();
            expect(pObj.segments.length).toBe(2);
        });

        it('should show me the help line', function () {
            tool.init(function (line) {
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            expect(paper.project._activeLayer.children.length).toBe(2);
            expect(paper.project._activeLayer.children[1].dashArray[0]).toBe(3000);
            expect(paper.project._activeLayer.children[1].dashArray[1]).toBe(1000);
            expect(paper.project._activeLayer.children[0].segments[0].point).toEqualPoint(new Point(20,20));
            expect(paper.project._activeLayer.children[1].segments[0].point).toEqualPoint(new Point(20,20));
            expect(paper.project._activeLayer.children[1].segments[1].point).toEqualPoint(new Point(21,21));
            tool.onMouseMove({point: new paper.Point(150, 30)});
            expect(paper.project._activeLayer.children.length).toBe(2);
            expect(paper.project._activeLayer.children[1].dashArray[0]).toBe(3000);
            expect(paper.project._activeLayer.children[1].dashArray[1]).toBe(1000);
            expect(paper.project._activeLayer.children[0].segments[0].point).toEqualPoint(new Point(20,20));
            expect(paper.project._activeLayer.children[1].segments[0].point).toEqualPoint(new Point(20,20));
            expect(paper.project._activeLayer.children[1].segments[1].point).toEqualPoint(new Point(150,30));
        });

        it('should allow me to select and move a line', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            pObj.fullySelected = true;
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(150, 30)});
            expect(pObj).toBeDefined();
            expect(pObj.segments.length).toBe(2);
            expect(pObj.segments[0].point.x).toEqual(20);
            expect(pObj.segments[0].point.y).toEqual(20);
            expect(pObj.segments[1].point.x).toEqual(180);
            expect(pObj.segments[1].point.y).toEqual(20);
        });

        it('should allow me to select a point on a line and move it', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            pObj.segments[0].selected = true;
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(150, 30)});
            expect(pObj.segments[0].point.x).toEqual(20);
            expect(pObj.segments[0].point.y).toEqual(20);
            expect(pObj.segments[1].point.x).toEqual(180);
            expect(pObj.segments[1].point.y).toEqual(20);
        });

        it('should allow me to change the color of a line', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            expect(pObj.strokeColor._canvasStyle).toEqual('rgb(0,0,255)');
            pObj.fullySelected = true;
            tool.onColorChange('red');
            expect(pObj.strokeColor._canvasStyle).toEqual('rgb(255,0,0)');
        });

        it('should allow me to change the color of a line during drawing', function () {
            tool.init(function (path) {
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            expect(paper.project._activeLayer.children.length).toBe(2);
            expect(paper.project._activeLayer.children[1].dashArray[0]).toBe(3000);
            expect(paper.project._activeLayer.children[1].dashArray[1]).toBe(1000);
            expect(paper.project._activeLayer.children[0].segments[0].point).toEqualPoint(new Point(20,20));
            expect(paper.project._activeLayer.children[1].segments[0].point).toEqualPoint(new Point(20,20));
            expect(paper.project._activeLayer.children[1].segments[1].point).toEqualPoint(new Point(21,21));
            expect(paper.project._activeLayer.children[1].strokeColor._canvasStyle).toEqual('rgb(0,0,255)');

            tool.onColorChange('red');
            expect(paper.project._activeLayer.children[1].strokeColor._canvasStyle).toEqual('rgb(255,0,0)');
        });

        it('should allow me to remove a point on a line', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            pObj.segments[0].selected = true;
            tool.onDeleteObjects();
            expect(pObj).toBeDefined();
            expect(pObj.segments.length).toBe(1);
            expect(pObj.segments[0].point.x).toEqual(180);
            expect(pObj.segments[0].point.y).toEqual(20);
        });

        it('should allow me to remove a line', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            pObj.fullySelected = true;
            expect(paper.project.activeLayer.children.length).toBe(1);
            tool.onDeleteObjects();
            expect(pObj).toBeDefined();
            expect(paper.project.activeLayer.children.length).toBe(0);
        });

        it('should allow me to remove the line tool', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            expect(paper.tools.length).toBe(1);
            tool.onDestroy();
            expect(paper.tools.length).toBe(0);
        });

        it('should unselect the line if a new frame is created', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');

            tool.onMouseDown({event: {offsetX: 20, offsetY: 20, button: 0}, point: new paper.Point(20, 20)});
            tool.onMouseDown({event: {offsetX: 180, offsetY: 20, button: 0}, point: new paper.Point(180, 20)});
            tool.onMouseDown({
                event: {offsetX: 20, offsetY: 20, button: 2},
                point: new paper.Point(20, 20),
                preventDefault: function () {
                }
            });
            pObj.fullySelected = true;
            tool.onNewFrame();
            expect(pObj.fullySelected).toBeFalsy();
        });
    });

    afterEach(function () {
        tool.onDestroy();
    });
});