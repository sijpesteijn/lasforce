'use strict';

describe('Lasforce Settings modal', function () {
    var lasforceSettings;

    beforeEach(function () {
        setup(['modals/lasforce-settings/lasforce-settings.html'],['colorpicker']);
        inject(function(_lasforceSettings_) {
            lasforceSettings = _lasforceSettings_;
        });
    });

    fdescribe('the view', function () {

        it('should show the default view', function () {
            lasforceSettings.openSettingsModal(userSettings);
            waitForBackdropAnimation();
            var body = angular.element(document.body);
            var input = body.find('div.modal-body div.tab-content input');
            expect(input.eq(0).val()).toBe('20');
            expect(input.eq(1).val()).toBe('1');
            expect(input.eq(2).attr('checked')).toBeFalsy();
        });

        it('should allow me to toggle infinitive', function () {
            lasforceSettings.openSettingsModal(userSettings);
            waitForBackdropAnimation();
            var body = angular.element(document.body);
            var input = body.find('div.modal-body div.tab-content input');
            expect(input.eq(2).attr('checked')).toBeFalsy();
            input.eq(2).click();
            $scope.$digest();
            //expect($scope.loopCount).toBe('-1');
        });

    });


});
