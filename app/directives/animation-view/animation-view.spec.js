'use strict';

describe('Animation view directive', function () {
    var directive;

    beforeEach(function () {
        setup(['directives/animation-view/animation-view.html']);
        $scope.animationId = angular.undefined;
        directive = compileDirective('<animation-view animation-id="animationId" loop-count="1" auto-play="true"></animation-view>');
    });

    describe('the view', function () {

        xit('should show the default view', function () {
            angular.element(document.body).append(directive.html());
            $scope.animationId = 1;
            $scope.$digest();
            console.log(directive.html());
            console.log(angular.element(document.body).html());
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});