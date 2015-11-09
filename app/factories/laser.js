'use strict';

app.factory('laser', function(settings) {
    var streaming = false;
    var ws;

    var init = function() {
        ws = new WebSocket(settings.get('rest.templ.laser'));
        ws.onmessage = function(event) {
            console.log('MESSAGE: ' + event.data);
        };
        ws.onopen = function(event) {
            console.log('OPEN');
        };
        ws.onclose = function(event) {
            console.log('CLOSE');
        };
    };

    var isOn = function() {
      return true;
    };

    var isStreaming = function() {
        return streaming;
    };

    var setStreaming = function(s) {
        streaming = s;
    };

    init();

    return {
        isOn: function() {
            return isOn();
        },
        isStreaming: function() {
            return isStreaming();
        },
        setStreaming: function (streaming) {
            setStreaming(streaming);
        }

    }
});
