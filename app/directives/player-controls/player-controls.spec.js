'use strict';

describe('Animation metadata directive', function () {
    var directive, paperWrapper, $interval;

    beforeEach(function () {
        setup(['directives/player-controls/player-controls.html']);
        inject(function(_$interval_, _paperWrapper_) {
            $interval = jasmine.createSpy('$interval', _$interval_);
            paperWrapper = _paperWrapper_;
        });
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
        $scope.currentFrameId = 0;
        directive = compileDirective('<player-controls animation="animation" current-frame-id="currentFrameId"></player-controls>');
    });

    describe('the view', function () {

        it('should show the default view', function () {
            expect(directive.find('div > h4').text().trim()).toEqual('Player');
            var buttons = directive.find('div.player-controls button');
            expect(buttons.eq(0).hasClass('disabled')).toBeTruthy();
            expect(buttons.eq(1).hasClass('disabled')).toBeTruthy();
            expect(buttons.eq(2).hasClass('disabled')).toBeTruthy();
            expect(buttons.eq(3).hasClass('disabled')).toBeTruthy();
            expect(buttons.eq(4).hasClass('disabled')).toBeTruthy();
            expect(buttons.eq(5).hasClass('disabled')).toBeTruthy();
            $scope.animation.frames.push({});
            $scope.$digest();
            expect(buttons.eq(0).hasClass('disabled')).toBeFalsy();
            expect(buttons.eq(1).hasClass('disabled')).toBeFalsy();
            expect(buttons.eq(2).hasClass('disabled')).toBeFalsy();
            expect(buttons.eq(3).hasClass('disabled')).toBeFalsy();
            expect(buttons.eq(4).hasClass('disabled')).toBeFalsy();
            expect(buttons.eq(5).hasClass('disabled')).toBeFalsy();
        });

        //it('should allow me to play a single run', function () {
        //    $scope.animation.frames.push({});
        //    $scope.$digest();
        //    var buttons = directive.find('div.player-controls button');
        //    buttons.eq(2).click();
        //    spyOn(paperWrapper, 'getLayers').and.callFake(function() { return $scope.animation.frames});
        //    spyOn(paperWrapper, 'hideLayer');
        //    spyOn(paperWrapper, 'showLayer');
        //    spyOn(paperWrapper, 'updateView');
        //    $interval.flush(directive.isolateScope().getFrameTime());
        //    $interval.flush(directive.isolateScope().getFrameTime());
        //});
        //
        //it('should allow me to play in a loop', function () {
        //    $scope.animation.frames.push({});
        //    $scope.animation.frames.push({});
        //    $scope.animation.frames.push({});
        //    $scope.$digest();
        //    var buttons = directive.find('div.player-controls button');
        //    buttons.eq(5).click();
        //    buttons.eq(2).click();
        //    spyOn(paperWrapper, 'getLayers').and.callFake(function() { return $scope.animation.frames});
        //    spyOn(paperWrapper, 'hideLayer');
        //    spyOn(paperWrapper, 'showLayer');
        //    spyOn(paperWrapper, 'updateView');
        //    var frameTime = directive.isolateScope().getFrameTime();
        //    for(var i = 0; i < $scope.animation.frames.length;i++) {
        //        $interval.flush(frameTime);
        //    }
        //});
        //
        //it('should allow me to use forward and backward buttons', function () {
        //    $scope.animation.frames.push({});
        //    $scope.animation.frames.push({});
        //    $scope.animation.frames.push({});
        //    $scope.$digest();
        //    spyOn(paperWrapper, 'getLayers').and.callFake(function() { return $scope.animation.frames});
        //    spyOn(paperWrapper, 'hideLayer');
        //    spyOn(paperWrapper, 'showLayer');
        //    spyOn(paperWrapper, 'updateView');
        //
        //    var buttons = directive.find('div.player-controls button');
        //    buttons.eq(3).click();
        //    expect($scope.currentFrameId).toBe(1);
        //    buttons.eq(4).click();
        //    expect($scope.currentFrameId).toBe(3);
        //    buttons.eq(1).click();
        //    expect($scope.currentFrameId).toBe(2);
        //    buttons.eq(0).click();
        //    expect($scope.currentFrameId).toBe(0);
        //    buttons.eq(5).click();
        //    buttons.eq(1).click();
        //    expect($scope.currentFrameId).toBe(3);
        //    console.log(directive.html());
        //});
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
