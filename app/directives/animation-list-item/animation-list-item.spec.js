'use strict';

describe('Animation list item directive', function () {
    var directive;

    beforeEach(function () {
        setup(['directives/animation-list-item/animation-list-item.html']);
        $scope.animation = animations[0];
        $scope.selectedAnimation = animations[0];
        directive = compileDirective('<animation-list-item draggable="true" animation="animation"></animation-list-item>');
    });

    describe('the view', function () {

        it('should show the default view', function () {
            console.log(directive.html());
            expect(directive.html()).toEqual('animation_1');
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});