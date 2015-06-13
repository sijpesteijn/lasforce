'use strict';

app.controller('animationListCtrl', function($scope, $resource, settings, uploadIldaFactory) {

  $scope.selectAnimation = function(animation) {
    console.log('Selected animation: ' + animation.name);
    $scope.selectedAnimation = animation;
  };

  $scope.uploadIlda = function() {
    uploadIldaFactory.openUploadFileModal();
  };

  function init() {
    $resource(settings.get('rest.templ.animation-list')).query(
      null,
      function(data) {
        $scope.animations = data;
      },
      function(data, status) {
        throw {
          message: 'Could not collect animations from server',
          status: status
        }
      });
  }

  init();
});

app.directive('animationList', function() {
  return {
    templateUrl: '/directives/animation-list/animation-list.html',
    controller: 'animationListCtrl',
    restrict: 'E',
    replace: true,
    scope: {
      draggable: '=',
      cbMouseOver: '&',
      cbMouseOut: '&',
      cbMouseClick: '&'
    }
  }
});

app.directive('animation', function() {
  return {
    templateUrl: '/directives/animation-list/animation.html',
    restrict: 'E',
    replace: true,
    scope: {
      draggable: '=',
      animation: '=',
      cbMouseOver: '&',
      cbMouseOut: '&',
      cbMouseClick: '&'
    },
    link: function(scope, element) {

      function init() {
        if (scope.draggable === true) {
          var options = {
            revert: true,
            cursor: "move",
            helper: function( event ) {
              return $( '<div class="dragging">' + scope.animation.name + '</div>' );
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

      init();
    }
  }
});
