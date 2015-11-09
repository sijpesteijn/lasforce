'use strict';

describe('Draw tools directive', function () {
    var directive;

    beforeEach(function () {
        setup(['directives/draw-tools/draw-tools.html'],['colorpicker']);
        directive = compileDirective('<draw-tools></draw-tools>');
    });

    describe('the view', function () {

        it('should show the default view', function () {
            //console.log(directive.html());
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});