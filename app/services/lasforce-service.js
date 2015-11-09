'use strict';

app.service('lasforceService', function() {
    var current_animation_id;

    return {
        setCurrentAnimationId : function(id) {
            current_animation_id = id;
        },
        getCurrentAnimationId : function() {
            return current_animation_id;
        }
    }
});