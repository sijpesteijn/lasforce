'use strict';

app.controller('animationPageCtrl', function ($scope, $location, $resource, settings, paperWrapper, animationPlayer) {
    $scope.zoom = 0.01;
    $scope.animationPlayer = animationPlayer;

    $scope.animationMouseOver = function (id) {
        $scope.current_animation_id = id;
        if (paperWrapper.isInitialized()) {
            $scope.animation = angular.undefined;
            animationPlayer.stop();
            paperWrapper.clearProject();
            $resource(settings.get('rest.templ.animation-list')).get({id: id}, {},
                function (data) {
                    paperWrapper.loadAnimation(data);
                    paperWrapper.showLayer(0);
                    $scope.current_frame_id = 0;
                    paperWrapper.updateView();
                    animationPlayer.init(data);
                    animationPlayer.play();
                },
                function (error) {
                    throw {
                        errorCode: 'AL002',
                        name: 'LasForceError',
                        error: error
                    }

                });
        }
    };

    $scope.animationMouseOut = function (id) {
        $scope.current_animation_id = angular.undefined;
        $scope.animation = angular.undefined;
        animationPlayer.stop();
        paperWrapper.clearProject();
    };

    $scope.editAnimation = function (id) {
        animationPlayer.stop();
        $location.path('edit_animation/' + id);
    }
});
