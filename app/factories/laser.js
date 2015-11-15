'use strict';

app.factory('laser', function (settings, paperWrapper) {
  var streaming = false;
  var connected = false;
  var ws;

  var init = function () {
    ws = new WebSocket(settings.get('rest.templ.laser'));
    ws.onmessage = function (event) {
      console.log('MESSAGE: ' + event.data);
    };
    ws.onopen = function (event) {
      connected = true;
    };
    ws.onclose = function (event) {
      connected = false;
    };
  };

  var play = function(animation, frameId) {
    var frame = paperWrapper.getPaperObjectMetaData(animation.frames[frameId].paperObject);
    var mesg = {type:'playFrame',frame:frame};
    //ws.binaryType = "arraybuffer";
    //var dataBytes = new Uint8Array(mesg.frameId);
    //var data = new ArrayBuffer(10000000);
    //ws.send(dataBytes);
    ws.send(JSON.stringify(mesg));
  };

  var isOn = function () {
    return connected;
  };

  var isStreaming = function () {
    return streaming;
  };

  var setStreaming = function (s) {
    streaming = s;
  };

  init();

  return {
    isOn: function () {
      return isOn();
    },
    isStreaming: function () {
      return isStreaming();
    },
    setStreaming: function (streaming) {
      setStreaming(streaming);
    },
    play: function (animation, frameId) {
      play(animation, frameId);
    }
  }
});
