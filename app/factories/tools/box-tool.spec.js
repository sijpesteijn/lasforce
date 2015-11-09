'use strict';

describe('Box tool factory', function () {
    var tool, $document;

    beforeEach(function () {
        setup();
        inject(function (_$document_, _boxTool_) {
            $document = _$document_;
            tool = _boxTool_;
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

        it('should allow me to draw a box', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(160, 160)});
            tool.onMouseUp();
            expect(pObj).toBeDefined();
            expect(pObj.segments.length).toBe(4);
            expect(pObj.segments[0].point).toEqualPoint(new Point(20,160));
            expect(pObj.segments[1].point).toEqualPoint(new Point(20,20));
            expect(pObj.segments[2].point).toEqualPoint(new Point(160,20));
            expect(pObj.segments[3].point).toEqualPoint(new Point(160,160));
            expect(pObj.fullySelected).toBeFalsy();
        });

        it('should allow me to draw a box and move it around', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(160, 160)});
            tool.onMouseUp();
            pObj.fullySelected = true;
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(100, 100)});
            expect(pObj.segments[0].point).toEqualPoint(new Point(100,240));
            expect(pObj.segments[1].point).toEqualPoint(new Point(100,100));
            expect(pObj.segments[2].point).toEqualPoint(new Point(240,100));
            expect(pObj.segments[3].point).toEqualPoint(new Point(240,240));
        });

        it('should allow me to draw a box and change the color afterwards', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(160, 160)});
            tool.onMouseUp();
            pObj.fullySelected = true;
            tool.onColorChange('red');
            pObj.fullySelected = false;
            expect(pObj.strokeColor._canvasStyle).toEqual('rgb(255,0,0)');
        });

        it('should allow me to draw a box and change the color during drawing', function () {
            var pObj;
            tool.init(function (path) {
                pObj = path;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onColorChange('red');
            tool.onMouseMove({point: new paper.Point(160, 160)});
            tool.onMouseUp();
            expect(pObj.strokeColor._canvasStyle).toEqual('rgb(255,0,0)');
        });

        it('should allow me to remove a box', function () {
            var pObj;
            tool.init(function (box) {
                pObj = box;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(160, 160)});
            tool.onMouseUp();
            pObj.fullySelected = true;
            expect(paper.project.activeLayer.children.length).toBe(1);
            tool.onDeleteObjects();
            expect(pObj).toBeDefined();
            expect(paper.project.activeLayer.children.length).toBe(0);
        });

        it('should allow me to remove the box tool', function () {
            var pObj;
            tool.init(function (box) {
                pObj = box;
            }, 'blue');
            expect(paper.tools.length).toBe(1);
            tool.onDestroy();
            expect(paper.tools.length).toBe(0);
        });

        it('should deselect the box if a new frame is created', function () {
            var pObj;
            tool.init(function (box) {
                pObj = box;
            }, 'blue');
            tool.onMouseDown({event: {offsetX: 20, offsetY: 20}, point: new paper.Point(20, 20)});
            tool.onMouseMove({point: new paper.Point(160, 160)});
            tool.onMouseUp();
            pObj.fullySelected = true;
            tool.onNewFrame();
            expect(pObj.fullySelected).toBeFalsy();
        });

    });

    afterEach(function () {
        tool.onDestroy();
    });
});