'use strict';

describe('History factory', function () {
    var history, $window;

    beforeEach(function () {
        setup();

        inject(function (_$window_, _history_) {
            $window = _$window_;
            history = _history_;
        });
    });

    describe('the factory', function () {


        it('should have default settings', function () {
            expect(history.canUndo()).toBeFalsy();
            expect(history.canRedo()).toBeFalsy();
            expect(history.getHistoryIndex()).toBe(0);
        });

        it('should allow me to add an item to the history', function () {
            var element1 = createFakePaperElement('element1');
            history.add(element1);
            expect(history.canUndo()).toBeTruthy();
            expect(history.canRedo()).toBeFalsy();
            expect(history.getHistoryIndex()).toBe(1);
        });

        it('should allow me to add two items to the history', function () {
            var element1 = createFakePaperElement('element1');
            var element2 = createFakePaperElement('element2');
            history.add(element1);
            history.add(element2);
            expect(history.canUndo()).toBeTruthy();
            expect(history.canRedo()).toBeFalsy();
            expect(history.getHistoryIndex()).toBe(2);
        });

        it('should allow me to remove an item from the history', function () {
            var element1 = createFakePaperElement('element1');
            var element2 = createFakePaperElement('element2');
            history.add(element1);
            history.add(element2);
            spyOn(element2.item, 'remove').and.callFake(function () {
                return true;
            });
            history.undo();
            expect(history.canUndo()).toBeTruthy();
            expect(history.canRedo()).toBeTruthy();
            expect(history.getHistoryIndex()).toBe(1);
        });

        it('should allow me to redo an undo on the history', function () {
            var element1 = createFakePaperElement('element1');
            var element2 = createFakePaperElement('element2');
            history.add(element1);
            history.add(element2);
            spyOn(element2.item, 'remove').and.callFake(function () {
                return true;
            });
            history.undo();
            spyOn(element2.parent, 'add').and.callFake(function () {

            });
            spyOn(element2.item, 'point').and.callFake(function () {
                return '';
            });
            history.redo();
            expect(history.canUndo()).toBeTruthy();
            expect(history.canRedo()).toBeFalsy();
            expect(history.getHistoryIndex()).toBe(2);
        });

        it('should allow me to add an item after an undo on the history', function () {
            var element1 = createFakePaperElement('element1');
            var element2 = createFakePaperElement('element2');
            var element3 = createFakePaperElement('element3');
            history.add(element1);
            history.add(element2);
            spyOn(element2.item, 'remove').and.callFake(function () {
                return true;
            });
            history.undo();
            history.add(element3);
            expect(history.canUndo()).toBeTruthy();
            expect(history.canRedo()).toBeFalsy();
            expect(history.getHistoryIndex()).toBe(2);
        });

        it('should allow me to clear the history', function () {
            var element1 = createFakePaperElement('element1');
            var element2 = createFakePaperElement('element2');
            history.add(element1);
            history.add(element2);

            history.clear();
            expect(history.canUndo()).toBeFalsy();
            expect(history.canRedo()).toBeFalsy();
            expect(history.getHistoryIndex()).toBe(0);

        });
    });

});