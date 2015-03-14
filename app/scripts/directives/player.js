app.controller('playerCtrl', function ($scope, $rootScope) {
});

app.directive('player', function ($rootScope, $i18next) {
    return {
        templateUrl: './views/player.html',
        restrict: 'E',
        replace: true,
        scope: {
        },
        controller: 'playerCtrl',
        link: function (scope, element, attrs) {
            scope.playing = false;
            $rootScope.currentFrame = 0;
            $rootScope.currentFrameName = $i18next('DRAW.NEW_FRAME') + ' 1';
            var play;
            var delay = 300;
            scope.canvasId = attrs.canvasId;
            var nrOfFrames = 0;

            $rootScope.$watch('selectFrameIndex', function (selectFrameIndex) {
                if (selectFrameIndex != undefined) {
                    console.log('Player selectFrameIndex: ' + selectFrameIndex);
                    project.layers[$rootScope.currentFrame].visible = false;
                    $rootScope.currentFrame = selectFrameIndex;
                    project.layers[$rootScope.currentFrame].visible = true;
                    paper.view.draw();
                }
            });

            $('#' + scope.canvasId).on('mousewheel', function(e) {
                if (e.shiftKey) {
                    var orgCenter = paper.view.center;
                    paper.view.center = new paper.Point(orgCenter.x + e.deltaX, orgCenter.y - e.deltaY);
                }
                if (e.altKey) {
                    var orgZoom = paper.view.zoom;
                    var zoomLevel = e.deltaY * 0.01;
                    var newZoomLevel = orgZoom + zoomLevel;
                    if (newZoomLevel <= 0.1) {
                        newZoomLevel = 0.1;
                    }
                    if (newZoomLevel >= 10) {
                        newZoomLevel = 10;
                    }
                    try {
                        paper.view.zoom = newZoomLevel;
                    } catch(err) {
                        console.log(newZoomLevel);
                    }
                    $('#playerZoom').slider('setValue', newZoomLevel);
                }
                e.preventDefault();
            });

            $('#playerZoom').slider({
                reversed : false,
                formater: function(value) {
                    return 'Current value: ' + value;
                }
            });

            $('#playerZoom').on('slide', function(e) {
                paper.view.zoom = e.value;
            });

            $('#playerSpeed').slider({
                reversed : true,
                formater: function(value) {
                    return 'Current value: ' + value;
                }
            });

            $('#playerSpeed').on('slide', function(e) {
                if (play != undefined) {
                    clearTimeout(play);
                    delay = e.value;
                    scope.playAnimation();
                }
            });

            scope.firstFrame = function() {
                setNrOfFrames();
                console.log('Moving to first frame of animation');
                project.layers[$rootScope.currentFrame].visible = false;
                $rootScope.currentFrame = 0;
                project.layers[$rootScope.currentFrame].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.currentFrame].name;
                paper.view.draw();
            }

            scope.previousFrame = function() {
                setNrOfFrames();
                console.log('Moving to previous frame of animation');
                project.layers[$rootScope.currentFrame--].visible = false;
                checkFrameNr();
                project.layers[$rootScope.currentFrame].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.currentFrame].name;
                paper.view.draw();
            }

            scope.playAnimation = function() {
                setNrOfFrames();
                project.activeLayer.visible = false;
                paper.view.draw();
                console.log('Playing animation');
                scope.playing = true;
                play = setInterval(animate, delay);
            }

            function animate() {
                setNrOfFrames();
                console.log('Moving to next frame of animation');
                project.layers[$rootScope.currentFrame++].visible = false;
                checkFrameNr();
                project.layers[$rootScope.currentFrame].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.currentFrame].name;
                $rootScope.$apply();
                paper.view.draw();
            }

            scope.stopAnimation = function() {
                console.log('Stop animation');
                scope.playing = false;
                clearTimeout(play);
            }

            scope.nextFrame = function() {
                setNrOfFrames();
                console.log('Moving to next frame of animation');
                project.layers[$rootScope.currentFrame++].visible = false;
                checkFrameNr();
                project.layers[$rootScope.currentFrame].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.currentFrame].name;
                paper.view.draw();
            }

            scope.lastFrame = function() {
                setNrOfFrames();
                console.log('Moving to last frame of animation');
                project.layers[$rootScope.currentFrame].visible = false;
                $rootScope.currentFrame = nrOfFrames -1;
                project.layers[$rootScope.currentFrame].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.currentFrame].name;
                paper.view.draw();
            }

            function setNrOfFrames() {
                nrOfFrames = project.layers.length;
            }

            function checkFrameNr() {
                if ($rootScope.currentFrame < 0) {
                    $rootScope.currentFrame = nrOfFrames;
                }
                if ($rootScope.currentFrame == nrOfFrames) {
                    $rootScope.currentFrame = 0;
                }
            }
        }
    };
});