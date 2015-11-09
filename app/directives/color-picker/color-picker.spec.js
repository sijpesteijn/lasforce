'use strict';

describe('Color picker directive', function () {
    var directive;

    beforeEach(function () {
        setup(['directives/color-picker/color-picker.html']);
        $scope.current_color = 'red';
        spyOn($,'colpick');
        directive = compileDirective('<colorpicker color-value="current_color"></colorpicker>');
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