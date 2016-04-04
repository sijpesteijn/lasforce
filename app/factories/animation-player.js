'use strict';

app.factory('animationPlayer', function($interval, paperWrapper) {
    var animation, playIntervals = [], playing = false, currentFrameId = undefined, loop = true;

    var init = function(ani) {
        animation = ani;
        currentFrameId = 0;
    };

    var getFrameTime = function() {
      // animation.metadata.framerate
        var delay = animation.frames.length * 10;
        return delay;
    };

    var forwardAnimation = function () {
        if (paperWrapper.getLayers().length > currentFrameId) {
            paperWrapper.hideLayer(currentFrameId);
        }
        if (currentFrameId == animation.frames.length - 1) {
            if (loop)
                currentFrameId = 0;
            else if (playing) {
                togglePlay();
            }
        }
        else
            currentFrameId++;
        paperWrapper.showLayer(currentFrameId);
        paperWrapper.updateView();
    };

    var play = function() {
        playIntervals.push($interval(function () {
            forwardAnimation();
        }, getFrameTime()));
    };

    var togglePlay = function() {
        playing = !playing;
        if (playing) {
            play();
        } else {
            stop();
        }
    };

    var stop = function() {
        angular.forEach(playIntervals, function (playInterval) {
            $interval.cancel(playInterval);
        });
        playIntervals = [];
    };

    var rewind = function() {
        paperWrapper.hideLayer(currentFrameId);
        currentFrameId = 0;
        paperWrapper.showLayer(currentFrameId);
        paperWrapper.updateView();
    };

    var backward = function() {
        paperWrapper.hideLayer(currentFrameId);
        if (currentFrameId == 0) {
            if (loop) {
                currentFrameId = animation.frames.length - 1;
            }
        } else {
            currentFrameId--;
        }
        paperWrapper.showLayer(currentFrameId);
        paperWrapper.updateView();
    };

    var forward = function() {
        if (paperWrapper.getLayers().length > currentFrameId) {
            paperWrapper.hideLayer(currentFrameId);
        }
        if (currentFrameId == animation.frames.length - 1) {
            if (loop) {
                currentFrameId = 0;
            } else if (playing) {
                play();
            }
        } else {
            currentFrameId++;
        }
        paperWrapper.showLayer(currentFrameId);
        paperWrapper.updateView();
    };

    var last = function() {
        paperWrapper.hideLayer(currentFrameId);
        currentFrameId = animation.frames.length - 1;
        paperWrapper.showLayer(currentFrameId);
        paperWrapper.updateView();
    };

    var showFrame = function(id) {
        paperWrapper.hideLayer(currentFrameId);
        currentFrameId = id;
        paperWrapper.showLayer(currentFrameId);
        paperWrapper.updateView();
    };

    var removeFrame = function(id) {
        if (paperWrapper.getActiveLayer().id-1 === id) {
            paperWrapper.getActiveLayer().visible = false;
        }
        if (currentFrameId === id) {
            currentFrameId--;
        }
        animation.frames.splice(id, 1);
        if (id < animation.frames.length) {
            var index = 0;
            angular.forEach(animation.frames, function(frame) {
                frame.id = index++;
            });
        }
        paperWrapper.removeLayer(id);
        paperWrapper.updateView();
        if(currentFrameId >= animation.frames.length) {
            currentFrameId--;
        }
        paperWrapper.showLayer(currentFrameId);
    };

    var addFrame = function(addChildren) {
        var paperObjects;
        if (paperWrapper.getLayers().length > 0)
            paperObjects = paperWrapper.getActiveLayer().children;
        paperWrapper.hideLayer(currentFrameId);

        var frameId = paperWrapper.getLayers().length;
        var frame = {
            name: 'Frame_' + frameId,
            id: frameId,
            shapes: []
        };
        paperWrapper.newLayer();
        paperWrapper.getActiveLayer().name = frame.name;
        paperWrapper.getActiveLayer().lasforceId = frame.id;
        if (addChildren) {
            angular.forEach(paperObjects, function (paperObject) {
                var clone = paperObject.clone();
                var metadata = paperWrapper.getPaperObjectMetaData(paperObject);
                frame.shapes.push(metadata);
                paperWrapper.getActiveLayer().addChild(clone);

            });
            paperWrapper.updateView();
        }
        animation.frames.push(frame);
    };

    var setLoop = function(l) {
        loop = l;
    };

    var getCurrentFrameId = function() {
        return currentFrameId;
    };

  return {
      init: function(animation) {
          init(animation);
      },
      togglePlay: function() {
          togglePlay();
      },
      play: function() {
          play();
      },
      stop: function() {
          stop();
      },
      rewind: function() {
          rewind();
      },
      backward: function() {
          backward();
      },
      forward: function() {
          forward();
      },
      last: function() {
          last();
      },
      getCurrentFrameId: function() {
          return getCurrentFrameId();
      },
      isPlaying : function() {
          return playing;
      },
      showFrame: function(id) {
          showFrame(id);
      },
      removeFrame: function(id) {
          removeFrame(id);
      },
      addFrame: function(addChildren) {
          return addFrame(addChildren);
      },
      setLoop: function(loop) {
          setLoop(loop);
      }
  }
});
