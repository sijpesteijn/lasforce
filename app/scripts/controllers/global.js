app.controller('globalCtrl', function ($scope, $modal) {
    $scope.view = 'createAnimation';

    $scope.createAnimation = function() {
        $scope.view = 'createAnimation';
    }

    $scope.createSequence = function() {
        $scope.view = 'createSequence';
    }

    $scope.showAnimation = function() {
        $scope.view = 'showAnimation';
    }

    var settingsCtrl = function($scope, $modalInstance) {
        $scope.companyName = Settings.CompanyName;

        $scope.save = function() {
            $modalInstance.close();
        }

        $scope.cancel = function() {
            $modalInstance.close();
        }
    };

    $scope.settings = function() {
        console.log('Settings selected');
        $modal.open({
            templateUrl: "./views/settings.html",
            controller: settingsCtrl
        });
    }


});
