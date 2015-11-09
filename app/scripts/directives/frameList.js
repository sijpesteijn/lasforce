app.controller('framelistCtrl', function ($scope, $rootScope) {

});

app.directive('framelist', function ($rootScope) {
    return {
        templateUrl: './views/framelist.html',
        restrict: 'E',
        replace: true,
        controller: 'framelistCtrl',
        scope: {
            name: '=',
            frames: '=',
            editable: '='
        },
        link: function (scope, element, attrs) {

            scope.loadFrame = function(indexNr) {
                console.log('Load frame nr: ' + indexNr);
                $rootScope.selectFrameIndex = indexNr;
                $rootScope.currentFrameName = scope.frames[indexNr].name;
            }

            scope.renameFrame = function(indexNr) {
                console.log('Rename frame nr: ' + indexNr);
            }
        }
    }
});
