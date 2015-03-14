app.config(function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate','$injector', function($delegate, $injector) {
        return function(exception, cause) {
            $delegate(exception, cause);

            var modal = $injector.get("$modal");
            var errorController = function($scope, $modalInstance, exception) {

              $scope.exception = exception;

              $scope.close = function() {
                $modalInstance.close();
              }

            }
            modal.open({
                templateUrl: "./views/error.html",
                controller: errorController,
                resolve: {
                  exception: function() {
                    return exception;
                  }
                }
            });

        };
    }]);
});

