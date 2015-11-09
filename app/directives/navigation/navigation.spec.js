'use strict';

describe('Navigation directive', function () {
    var directive, lasforceSettings;
    var settings = {
        framerate: 20,
        loopCount: 1,
        color: '#123123'
    };

    beforeEach(function () {
        setup(['directives/navigation/navigation.html', 'pages/animation_collection_page/animation_collection_page.html', 'pages/sequence_page/sequence_page.html', 'pages/show_page/show_page.html', 'pages/animation_edit_page/animation_edit_page.html'], ['showList', 'showView', 'animationList', 'animationView', 'drawTools', 'drawToolInfo', 'frameElements', 'animationCanvas', 'playerControls', 'animationMetadata', 'animationFrames', 'sequenceList' ,'sequenceView', 'sequenceTimeline']);
        inject(function (_lasforceSettings_) {
            lasforceSettings = _lasforceSettings_;
        });

    });

    describe('the view', function () {

        beforeEach(function () {
            $httpBackend.expectGET('/laser/rest/settings').respond(userSettings);
            directive = compileDirective('<navigation></navigation>');
            $httpBackend.flush();
        });

        it('should show the default view', function () {
            spyOn(lasforceSettings, 'openSettingsModal').and.returnValue({result: {
                then: function(confirmCallback, cancelCallback) {
                    confirmCallback(settings);
                }
            }});
            directive.find('i.fa-cog').click();
        });
    });
});