'use strict';

app.controller('animationMetadataCtrl', function ($scope, $resource, settings, paperWrapper) {
    var framerate;

    function init() {
        framerate = $('#framerate').spinner({
            spin: function (event, ui) {
                $scope.animation.metadata.framerate = this.value;
            },
            change: function (event, ui) {
                $scope.animation.metadata.framerate = this.value;
            }
        });
        framerate.val(0); //$scope.animation.metadata.framerate);
    }

    $scope.save = function () {
        var layers = paperWrapper.getObjectTree();
        $scope.animation.frames = layers;
        $resource(settings.get('rest.templ.animationSave')).save(
            null,
            $scope.animation,
            function (data) {
                console.log('Saved: ' + data);
                $.infoBox({
                    title: "Animation saved",
                    content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
                    color: "#296191",
                    iconInfo: "fa fa-thumbs-up bounce animated",
                    timeout: 3000
                });

            },
            function (error, status) {
                throwError('A003', error, status);
            });

    };

    $scope.$watch('animation', function (newValue) {
        if (angular.isDefined($scope.animation)) {
            init();
        }
    });

    $scope.$watch('animation.metadata.framerate', function (newValue) {
        if (angular.isDefined(newValue))
            framerate.val(newValue);
    });

    $scope.updateFramerate = function () {
        $scope.animation.metadata.framerate = framerate.val();
    };

    //init();
});

app.directive('animationMetadata', function () {
    return {
        templateUrl: 'directives/animation-metadata/animation-metadata.html',
        controller: 'animationMetadataCtrl',
        replace: true,
        scope: {
            animation: '='
        }
    }
});
