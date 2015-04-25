app.controller('animationCtrl', function ($scope, $rootScope, $http, settings) {
    $scope.animations;
    $scope.selectedAnimation;

    $http({method: 'GET', url: settings.get('rest.templ.animationList')}).
        success(function (data, status, headers, config) {
            console.log(data);
            $scope.animations = data;
        }).
        error(function (data, status, headers, config) {
            throw {
                message: 'Could not collected animations from server',
                status: status
            }
        });

    $scope.loadAnimation = function (name) {
        console.log('Loading animation: ' + name);
        $http({method: 'GET', url: 'rest/animation/load/' + name}).
            success(function (data) {
                console.log(data);
                $scope.selectedAnimation = data;
                $scope.name = data.name;
            })
    };
});
