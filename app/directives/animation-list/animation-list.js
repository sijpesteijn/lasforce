'use strict';

app.controller('animationListCtrl', function($scope, $resource, settings, uploadIldaFactory) {

  $scope.selectAnimation = function(animation) {
    console.log('Selected animation: ' + animation.name);
    $scope.selectedAnimation = animation;
  };

  $scope.createAnimation = function() {
    var animation = {
      name: $scope.newAnimation
    };
    $resource(settings.get('rest.templ.animation-update')).save(
      null,
      animation,
      function(data) {
        $scope.selectedAnimation = data;
        $scope.animations.push(data);
        $scope.openAddAnimation = false;
        $scope.newAnimation = '';
      },
      function(data, status) {
        throw {
          message: 'Could not save animation',
          status: status
        }
      });
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
      animation: '=',
      cbMouseOver: '&',
      cbMouseOut: '&',
      cbMouseClick: '&'
    },
    link: function(scope, element) {

      function init() {
        if (scope.draggable === true) {
          var options = {
            revert: true
          };
          options.start = function(event, ui) {
            element.addClass('timeline-element');
          };
          options.stop = function(event, ui) {
            element.removeClass('timeline-element');
            console.log('Stopped');
          };
          if (angular.isDefined(scope.snapTo)) {
            options.snap = scope.snapTo;
          }
          element.draggable(options);
        }
      }

      init();
    }
  }
});
