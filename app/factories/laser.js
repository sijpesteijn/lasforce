'use strict';

app.factory('laser', function (settings) {
  var streaming = false;
  var laserConnected = false;
  var ws;

  var init = function () {
    ws = new WebSocket(settings.get('rest.templ.laser'));
    ws.onmessage = function (event) {
      console.log('MESSAGE: ' + event.data);
      var response = JSON.parse(event.data);
      handleResponse(response);
    };
    ws.onopen = function (event) {
    };
    ws.onclose = function (event) {
      streaming = false;
      init();
    };
  };

  var handleResponse = function(response) {
    console.log(response.type);
    if (response.type === 'connect_laser') {
      laserConnected = response.status;
    }
  };

  var play = function(animation, frameId) {
    //connectLaser();
    var segments = [];
    for(var i=0;i<10;i++) {
      var segment = { type:'segment',point:{type:'point',name:'point_'+i,x:i,y:i}};
      segments.push(segment);
    }
    var frame = {id:0,name:'Frame ' + frameId, shapes:[{type:'path',id:0,isApplyMatrix:true,strokeWidth:4,strokeColor:{blue:1,red:1,green:1},name:'path_1',isClosed:true,segments:segments}]};
    var mesg = {type:'play_frame',frame:frame};
    ws.send(JSON.stringify(mesg));
    ws.onmessage = function(event) {
      console.log('PLAY: ' + event.data);
    }
  };

  var connectLaser = function() {
    var msg = { type: 'connect_laser'};
    ws.send(JSON.stringify(msg));
  };

  var disconnectLaser = function() {

  };

  var isStreaming = function () {
    return streaming;
  };

  var setStreaming = function (s) {
    streaming = s;
  };

  var isSocketConnected = function() {
    if (ws && ws.readyState == 1) {
      return true;
    }
    return false;
  };

  var connectSocket = function() {
    init();
  };

  var disconnectSocket = function() {
    ws.close();
    ws = angular.undefined;
  };

  var blank = function() {
    var msg = { type: 'laser_cmd', key: 'blank'};
    ws.send(JSON.stringify(msg));
  };

  init();

  return {
    isSocketConnected: function() {
      return isSocketConnected();
    },
    connectSocket: function() {
      connectSocket();
    },
    disconnectSocket: function() {
      disconnectSocket();
    },
    isLaserConnected: function () {
      return laserConnected;
    },
    connectLaser: function() {
      connectLaser();
    },
    disconnectLaser: function() {
      disconnectLaser();
    },
    isStreaming: function () {
      return isStreaming();
    },
    setStreaming: function (streaming) {
      setStreaming(streaming);
    },
    play: function (animation, frameId) {
      play(animation, frameId);
    },
    blank: function() {
      blank();
    }
  }
});
