'use strict';

describe('Animation frames list directive', function () {
    var directive, animationPlayer;

    beforeEach(function () {
        setup(['directives/animation-frames/animation-frames.html']);
        inject(function(_animationPlayer_) {
            animationPlayer = _animationPlayer_;
        });
        $scope.animation = {
            name: 'Animation_0',
            framerate: 30,
            frames: [
                {
                    name: 'Frame_0',
                    id: 0,
                    shapes: []
                }]
        };
        directive = compileDirective('<animation-frames animation="animation"></animation-frames>');
        spyOn(animationPlayer, 'getCurrentFrameId').and.returnValue(0);
        $scope.$digest();
    });

    describe('the view', function () {

        it('should show the default view', function () {
            var frames = directive.find('div.frame-list > div');
            expect(frames.length).toBe(1);
            expect(frames.eq(0).find('span.input-group-addon > i').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).text().trim()).toEqual('Frame_0');
        });

        it('should allow me to change the frame names', function () {
            $scope.animation.frames.push({
                name: 'Frame_1',
                id: 1,
                shapes: []
            });
            $scope.$digest();
            var frames = directive.find('div.frame-list > div');
            expect(frames.length).toBe(2);
            expect(frames.eq(0).find('span.input-group-addon > i').hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).text().trim()).toEqual('Frame_0');
            expect(frames.eq(1).find('span.input-group-addon > i').hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(1).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(1).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(1).text().trim()).toEqual('Frame_1');
            frames.eq(0).find('span').eq(0).find('i').click();
            expect(frames.eq(0).find('input').hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).find('span').eq(1).hasClass('ng-hide')).toBeTruthy();
            frames.eq(0).find('input').val('Moemoe');
            frames.eq(0).find('input').trigger('input');
            var e = $.Event('keyup');
            e.keyCode = 13;
            frames.eq(0).find('input').triggerHandler(e);

            frames.eq(1).find('input').val('Bladiebla');
            frames.eq(1).find('input').trigger('input');
            e = $.Event('keyup');
            e.keyCode = 13;
            frames.eq(1).find('input').triggerHandler(e);

            expect(frames.eq(0).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).text().trim()).toEqual('Moemoe');
            expect(frames.eq(1).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(1).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(1).text().trim()).toEqual('Bladiebla');
        });

        it('should allow me to change the current frame id by selecting different frames', function () {
            $scope.animation.frames.push({
                name: 'Frame_1',
                id: 1,
                shapes: []
            });
            $scope.animation.frames.push({
                name: 'Frame_2',
                id: 2,
                shapes: []
            });
            $scope.$digest();
            var frameId;
            spyOn(animationPlayer,'showFrame').and.callFake(function(id) {
                frameId = id;
            });

            var frames = directive.find('div.frame-list > div');
            expect(frames.length).toBe(3);
            frames.eq(2).find('span').eq(1).click();
            expect(frameId).toBe(2);
            frames.eq(0).find('span').eq(1).click();
            expect(frameId).toBe(0);
            frames.eq(1).find('span').eq(1).click();
            expect(frameId).toBe(1);
        });

        it('should allow me to remove all frames except one', function () {
            $scope.animation.frames.push({
                name: 'Frame_1',
                id: 1,
                shapes: []
            });
            $scope.animation.frames.push({
                name: 'Frame_2',
                id: 2,
                shapes: []
            });
            $scope.$digest();
            var removeId;
            spyOn(animationPlayer, 'removeFrame').and.callFake(function(id) {
                removeId = id;
            });
            var frames = directive.find('div.frame-list div');
            expect(frames.length).toBe(3);
            frames.eq(2).find('span').eq(2).find('i').click();
            expect(removeId).toBe(2);
            frames = directive.find('div.frame-list div');
            frames.eq(1).find('span').eq(2).find('i').click();
            expect(removeId).toBe(1);

        });

        it('should allow me to add a frame and copy all children from previous frame', function () {
            var frames = directive.find('div.frame-list > div');
            var addFrame = directive.find('div.panel-heading > button');
            var copyChilderen = directive.find('div.panel-heading > input');
            expect(frames.length).toBe(1);
            expect(frames.eq(0).find('span.input-group-addon > i').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).text().trim()).toEqual('Frame_0');

            spyOn(animationPlayer, 'addFrame').and.callFake(function () {
                return {length: directive.isolateScope().animation.frames.length};
            });
            addFrame.click();
        });

        it('should allow me to add a frame without copying all children from previous frame', function () {
            var frames = directive.find('div.frame-list > div');
            var addFrame = directive.find('div.panel-heading > button');
            var copyChilderen = directive.find('div.panel-heading > input');
            copyChilderen.click();
            expect(frames.length).toBe(1);
            expect(frames.eq(0).find('span.input-group-addon > i').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('input').hasClass('ng-hide')).toBeTruthy();
            expect(frames.eq(0).find('span').eq(1).hasClass('ng-hide')).toBeFalsy();
            expect(frames.eq(0).text().trim()).toEqual('Frame_0');

            spyOn(animationPlayer, 'addFrame').and.callFake(function () {
                return {length: directive.isolateScope().animation.frames.length};
            });
            addFrame.click();
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});