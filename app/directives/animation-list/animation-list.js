(function () {
  'use strict';

  app.controller('animationListCtrl', animationListController).directive('animationList', animationListDirective);

  animationListController.$inject = ['$scope','$resource','settings','uploadIldaFactory'];

  function animationListController($scope, $resource, settings, uploadIldaFactory) {

    $scope.uploadIlda = function () {
      uploadIldaFactory.openUploadFileModal().result.then(function (data) {
        $scope.init();
      });
    };

    $scope.init = function () {
      $resource(settings.get('rest.templ.animation-list')).query(
        null,
        function (data) {
          $scope.animations = data;
        },
        function (error) {
          throw {
            errorCode: 'AL001',
            name: 'LasForceError',
            error: error
          }
        });
    };

    $scope.removeAnimation = function (id) {
      $resource(settings.get('rest.templ.animation-list')).delete({id: id}, {},
        function (data) {
          $scope.init();
        },
        function (error) {
          throw {
            errorCode: 'AL002',
            name: 'LasForceError',
            error: error
          }

        });
    };
    $scope.init();
  }

  function animationListDirective() {
    return {
      templateUrl: 'directives/animation-list/animation-list.html',
      controller: 'animationListCtrl',
      controllerAs: 'cntrl',
      restrict: 'E',
      replace: true,
      scope: {
        draggable: '=',
        cbMouseOver: '&',
        cbMouseOut: '&',
        cbMouseClick: '&'
      }
    }
  }
})();
