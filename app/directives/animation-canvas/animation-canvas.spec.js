'use strict';

describe('Animation canvas directive', function () {
    var directive, paperWrapper;

    beforeEach(function () {
        setup(['directives/animation-canvas/animation-canvas.html']);
        inject(function(_paperWrapper_) {
            paperWrapper = _paperWrapper_;
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
        spyOn(paperWrapper, 'setup');
        spyOn(paperWrapper, 'getActiveLayer').and.callFake(function() { return {name:''}; });
        directive = compileDirective('<animation-canvas animation="animation"></animation-canvas>');
    });

    describe('the view', function () {

        it('should show the default view', function () {
            console.log(directive.html());
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});