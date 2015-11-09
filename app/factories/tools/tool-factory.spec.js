'use strict';

describe('Tool factory', function () {
    var toolFactory, lineTool, boxTool;

    beforeEach(function () {
        setup();
        inject(function (_toolFactory_, _lineTool_, _boxTool_) {
            toolFactory = _toolFactory_;
            lineTool = jasmine.createSpy(_lineTool_);
            boxTool = jasmine.createSpy(_boxTool_);
        });
    });

    describe('the factory', function () {

        it('should return the correct tool', function () {
            var tool = toolFactory.getTool('line');
            expect(tool).toBeDefined();
            expect(tool.name).toEqual('line');
            tool = toolFactory.getTool('box');
            expect(tool).toBeDefined();
            expect(tool.name).toEqual('box');
        });

    });

});