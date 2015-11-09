'use strict';

describe('Animation list directive', function () {
    var directive, overValue, outValue, clickValue, uploadIldaFactory, $location, $route;

    function mouseOver(data) {
        overValue = data.animationId;
    }

    function mouseOut(data) {
        outValue = data.animationId;
    }

    function mouseClick(data) {
        clickValue = data.animationId;
    }

    beforeEach(function () {
        setup(['directives/animation-list/animation-list.html','directives/animation-list-item/animation-list-item.html','pages/show_page/show_page.html','pages/animation_edit_page/animation_edit_page.html'], ['animation']);
        inject(function (_uploadIldaFactory_, _$location_, _$route_) {
            uploadIldaFactory = _uploadIldaFactory_;
            $location = _$location_;
            $route = _$route_;
        })
    });

    describe('the view', function () {

        beforeEach(function() {
            $httpBackend.expectGET('/laser/rest/animations').respond(animations);
            directive = compileDirective('<animation-list cb-mouse-over="mouseOver()" cb-mouse-out="mouseOut()" cb-mouse-click="mouseClick()"></animation-list>');
            $httpBackend.flush();
        });

        it('should show the default view', function () {
            directive.isolateScope().cbMouseClick = mouseClick;
            directive.isolateScope().cbMouseOver = mouseOver;
            directive.isolateScope().cbMouseOut = mouseOut;
            var animationList = directive.find('div.panel-body > ul > li');
            expect(animationList.length).toBe(4);
            animationList.eq(0).click();
            expect(clickValue).toBe(animations[3].id);
            animationList.eq(1).triggerHandler('mouseover');
            expect(overValue).toBe(animations[2].id);
            animationList.eq(1).triggerHandler('mouseout');
            expect(overValue).toBe(animations[2].id);
        });

        it('should allow me to upload an ilda file', function () {
            spyOn(uploadIldaFactory, 'openUploadFileModal').and.callFake(function () {
            });
            var buttons = directive.find('div.panel-heading button');
            buttons.eq(1).click();
        });

        it('should allow me to create a new animation', function () {
            var buttons = directive.find('div.panel-heading button');
            buttons.eq(0).click();
            $location.path('create_animation');
            $scope.$apply();
            expect($route.current.templateUrl).toEqual('pages/animation_edit_page/animation_edit_page.html');
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});