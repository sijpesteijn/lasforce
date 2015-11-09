'use strict';

describe('Animation metadata directive', function () {
    var directive, paperWrapper;

    beforeEach(function () {
        setup(['directives/animation-metadata/animation-metadata.html']);
        $scope.animation = {
            metadata: {
                name: 'Animation_0',
                framerate: 30
            },
            frames: [
                {
                    name: 'Frame_0',
                    id: 0,
                    shapes: []
                }]
        };
        inject(function(_paperWrapper_) {
           paperWrapper = _paperWrapper_;
        });
        directive = compileDirective('<animation-metadata animation="animation"></animation-metadata>');
    });

    describe('the view', function () {

        it('should show the default view', function () {
            expect(directive.find('div.panel-body > div > input').val()).toEqual('Animation_0');
            expect(directive.find('div.panel-body > div').eq(1).find('input').val()).toEqual('30');
            expect(directive.find('div.panel-body > div').eq(2).find('span').text().trim()).toEqual('1');
        });

        it('should update the view when a different animation is loaded', function () {
            expect(directive.find('div.panel-body > div > input').val()).toEqual('Animation_0');
            expect(directive.find('div.panel-body > div').eq(1).find('input').val()).toEqual('30');
            expect(directive.find('div.panel-body > div').eq(2).find('span').text().trim()).toEqual('1');
            $scope.animation = {
                metadata: {
                name: 'Animation_1',
                framerate: 25}
                ,
                frames: [
                    {}, {}]
            };
            $scope.$digest();
            expect(directive.find('div.panel-body > div > input').val()).toEqual('Animation_1');
            expect(directive.find('div.panel-body > div').eq(1).find('input').val()).toEqual('25');
            expect(directive.find('div.panel-body > div').eq(2).find('span').text().trim()).toEqual('2');
        });

        it('should allow me to update the metadata', function () {
            var name = directive.find('div.panel-body > div > input');
            name.val('Moemoe');
            name.trigger('input');
            var e = $.Event('keyup');
            e.keyCode = 13;
            name.triggerHandler(e);
            expect(directive.find('div.panel-body > div > input').val()).toEqual('Moemoe');
            var framerate = directive.find('div.panel-body > div').eq(1).find('input');
            framerate.val(25);
            // TODO check spinner
            //framerate.trigger('input');
            //framerate.triggerHandler(e);

            expect(framerate.val()).toEqual('25');
            $scope.animation.frames.push({});
            $scope.$digest();
            expect(directive.find('div.panel-body > div').eq(2).find('span').text().trim()).toEqual('2');
        });

        it('should allow me to save the animation', function () {
            var save = directive.find('div.panel-heading button');
            $httpBackend.expectPOST('/laser/rest/animations/save').respond(200);
            spyOn($, 'infoBox');
            spyOn(paperWrapper,'getObjectTree').and.returnValue([]);
            save.click();
            $httpBackend.flush();
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
