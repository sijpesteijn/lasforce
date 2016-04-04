'use strict';

app.factory('laser', function (settings) {
  var socketConnected = false;
  //var streaming = false;
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
      socketConnected = true;
    };
    ws.onclose = function (event) {
      socketConnected = false;
    };
  };

  var handleResponse = function(response) {
    console.log(response.type);
    if (response.type === 'connect_laser') {
      laserConnected = response.status;
    }
  };

  var playAnimation = function(animationId, repeat) {
    var msg = {'type':'laser_cmd','cmd':'play','value':{'animationId': animationId, 'repeat':repeat, 'frameTime': 1000}};
    ws.send(JSON.stringify(msg));
  };

  var playAnimationFrame = function(animationId, frameId, repeat) {
    var msg = {'type':'laser_cmd','cmd':'play_frame','value':{'animationId':animationId,'frameId':frameId, 'repeat':repeat, 'frameTime': 1000}};
    ws.send(JSON.stringify(msg));
  };

  var connectLaser = function() {
    if (socketConnected) {
      var msg = {type: 'connect_laser'};
      ws.send(JSON.stringify(msg));
    }
  };

  var disconnectLaser = function() {

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
    var msg = { type: 'laser_cmd', cmd: 'stop'};
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
    playAnimation: function(animationId, repeat) {
      playAnimation(animationId, repeat);
    },
    playAnimationFrame: function(animationId, frameId, repeat) {
      playAnimationFrame(animationId, frameId, repeat);
    },
    blank: function() {
      blank();
    }
  }
});
