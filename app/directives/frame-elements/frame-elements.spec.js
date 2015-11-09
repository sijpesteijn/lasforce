'use strict';

describe('Frame Elements Directive', function () {
    var directiveElem, frameSegments;

    beforeEach(function () {
        setup(['directives/frame-elements/frame-elements.html']);
        $scope.current_frame = {shapes:[]};
        $scope.current_frame.shapes = frameSegments;

        directiveElem = compileDirective('<frame-elements></frame-elements>');
    });

    describe('Panel', function () {

        it('should show the title "Elements"', function () {
            var title = directiveElem.find('h4');
            expect(title.text()).toEqual('Elements');
        });
    });

    describe('Tree', function() {

        it('should show the two parent nodes. When I click the second parent the 2 children nodes should show.', function() {
            var rootNodes = directiveElem.find('treecontrol ul li');
            expect(rootNodes.length).toBe(2);
            expect(rootNodes[0].innerText.trim()).toEqual($scope.current_frame.shapes[0].name);
            var childNodes = rootNodes.find('ul li');
            expect(childNodes.length).toBe(0);

            rootNodes.eq(1).find('i').eq(0).click(); // expand the parent node
            childNodes = rootNodes.eq(0).find('ul li');
            expect(childNodes.length).toBe(0);
            childNodes = rootNodes.eq(1).find('ul li');
            expect(childNodes.length).toBe(2);

            expect(childNodes[0].innerText.trim()).toEqual($scope.current_frame.shapes[1].segments[0].point.name);
            expect(childNodes[1].innerText.trim()).toEqual($scope.current_frame.shapes[1].segments[1].point.name);
        });

        it('should show the edit box when I click on the edit button of the first parent', function() {
            var rootNodes = directiveElem.find('treecontrol ul li');
            expect(rootNodes.length).toBe(2);
            expect(rootNodes[0].innerText.trim()).toEqual($scope.current_frame.shapes[0].name); // check original name

            var input = rootNodes.eq(0).find('input');

            expect(input).toBeHidden();
            rootNodes.eq(0).find('.fa-edit').click(); // click the edit button
            expect(rootNodes.eq(0).find('.fa-edit')).toBeHidden();
            expect(input.hasClass('ng-hide')).toBeFalsy();

            input.val('Moemoe');
            input.trigger('input');
            var e = $.Event('keyup');
            e.keyCode = 13;
            input.triggerHandler(e);

            console.log(rootNodes.html());
            //rootNodes.eq(0).find('.fa-save').click(); // click the save button
            expect(input.hasClass('ng-hide')).toBeTruthy();
            expect($scope.current_frame.shapes[0].name).toBe('Moemoe');
        });

        it('should select the shape when a mouse over occurs', function() {
            var rootNodes = directiveElem.find('treecontrol ul li');
            rootNodes.find('span').triggerHandler('mouseover');
            expect($scope.current_frame.shapes[0].fullySelected).toBeTruthy();
            rootNodes.find('span').triggerHandler('mouseout');
            expect($scope.current_frame.shapes[0].fullySelected).toBeFalsy();

        });
    });

    frameSegments = [
        {
            name: 'parent1',
            getClassName: function() { return 'Path'},
            segment: {
                edit: false,
                selected: false
            },
            segments: [
                {
                    point: {name: 'child1'},
                    segment: {
                        edit: false,
                        selected: false
                    }
                },
                {
                    point: {name: 'child2'},
                    segment: {
                        edit: false,
                        selected: false
                    }
                }
            ]
        },
        {
            name: 'parent2',
            getClassName: function() { return 'Path'},
            segment: {
                edit: false,
                selected: false
            },
            segments: [
                {
                    point: {name: 'child3'},
                    segment: {
                        edit: false,
                        selected: false
                    }
                },
                {
                    point: {name: 'child4'},
                    segment: {
                        edit: false,
                        selected: false
                    }
                }
            ]
        }
    ]
});
