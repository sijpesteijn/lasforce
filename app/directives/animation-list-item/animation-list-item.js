'use strict';

app.directive('animationListItem', function () {
    return {
        templateUrl: 'directives/animation-list-item/animation-list-item.html',
        restrict: 'E',
        replace: true,
        scope: {
            draggable: '=',
            animation: '='
        },
        link: function (scope, element) {

            function init() {
                if (scope.draggable === true) {
                    var options = {
                        revert: true,
                        cursor: "move",
                        helper: function (event) {
                            return $('<div class="dragging">' + scope.animation.name + '</div>');
                        }
                    };
                    //options.start = function(event, ui) {
                    //  element.addClass('timeline-element');
                    //};
                    //options.stop = function(event, ui) {
                    //  element.removeClass('timeline-element');
                    //  console.log('Stopped');
                    //};
                    //if (angular.isDefined(scope.snapTo)) {
                    //  options.snap = scope.snapTo;
                    //}
                    element.draggable(options);
                }
            }

            //init();
        }
    }
});
