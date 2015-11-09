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
            $rootScope.current_frame_id = 0;
            $rootScope.currentFrameName = $i18next('DRAW.NEW_FRAME') + ' 1';
            var play;
            var delay = 300;
            scope.canvasId = attrs.canvasId;
            var nrOfFrames = 0;

            $rootScope.$watch('selectFrameIndex', function (selectFrameIndex) {
                if (selectFrameIndex != undefined) {
                    console.log('Player selectFrameIndex: ' + selectFrameIndex);
                    project.layers[$rootScope.current_frame_id].visible = false;
                    $rootScope.current_frame_id = selectFrameIndex;
                    project.layers[$rootScope.current_frame_id].visible = true;
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
                project.layers[$rootScope.current_frame_id].visible = false;
                $rootScope.current_frame_id = 0;
                project.layers[$rootScope.current_frame_id].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.current_frame_id].name;
                paper.view.draw();
            }

            scope.previousFrame = function() {
                setNrOfFrames();
                console.log('Moving to previous frame of animation');
                project.layers[$rootScope.current_frame_id--].visible = false;
                checkFrameNr();
                project.layers[$rootScope.current_frame_id].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.current_frame_id].name;
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
                project.layers[$rootScope.current_frame_id++].visible = false;
                checkFrameNr();
                project.layers[$rootScope.current_frame_id].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.current_frame_id].name;
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
                project.layers[$rootScope.current_frame_id++].visible = false;
                checkFrameNr();
                project.layers[$rootScope.current_frame_id].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.current_frame_id].name;
                paper.view.draw();
            }

            scope.lastFrame = function() {
                setNrOfFrames();
                console.log('Moving to last frame of animation');
                project.layers[$rootScope.current_frame_id].visible = false;
                $rootScope.current_frame_id = nrOfFrames -1;
                project.layers[$rootScope.current_frame_id].visible = true;
                $rootScope.currentFrameName = project.layers[$rootScope.current_frame_id].name;
                paper.view.draw();
            }

            function setNrOfFrames() {
                nrOfFrames = project.layers.length;
            }

            function checkFrameNr() {
                if ($rootScope.current_frame_id < 0) {
                    $rootScope.current_frame_id = nrOfFrames;
                }
                if ($rootScope.current_frame_id == nrOfFrames) {
                    $rootScope.current_frame_id = 0;
                }
            }
        }
    };
});
