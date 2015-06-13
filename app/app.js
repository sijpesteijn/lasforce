'use strict';

/**
 * @ngdoc overview
 * @name lasforceApp
 * @description
 * # lasforceApp
 *
 * Main module of the application.
 */
var app = angular
  .module('lasforceApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'gridster',
    'jm.i18next',
    'ui.bootstrap',
    'angularFileUpload',
    'treeControl'
  ]);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/animations', {
        templateUrl: 'pages/animation_page/animation_page.html'
      })
      .when('/create_animation', {
        templateUrl: 'pages/animation_edit_page/animation_edit_page.html'
      })
      .when('/sequences', {
        templateUrl: 'pages/sequence_page/sequence_page.html'
      })
      .when('/shows', {
        templateUrl: 'pages/show_page/show_page.html'
      })
      .otherwise({
        redirectTo: '/shows'
      });
  });

app.config(function ($i18nextProvider) {
  $i18nextProvider.options = {
    preload: ['en'],
    useCookie: false,
    useLocalStorage: false,
    fallbackLng: 'en',
    getAsync: false, // als dit niet op false staat worden de vertalingen voor oa. pagination te laat geladen
    resGetPath: './i18n/locale-__lng__.json'
  };
});

app.config(function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate','$injector', function($delegate, $injector) {
    return function(exception, cause) {
      $delegate(exception, cause);
      var rootScope = $injector.get('$rootScope');
      var i18next = $injector.get('$i18next');

      if (exception.name === 'LasForceError') {
        var message = i18next('ERROR.' + exception.errorCode);
        $.infoBox({
          title: message,
          content: "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
          color: '#E7110B',
          sound: 'error',
          iconInfo: 'fa fa-thumbs-down bounce animated'
        });

      }
    };
  }]);
});

app.factory('settings', function () {
    var lookupOptions = {
        lng: 'c',
        defaultValue: '=undefined='
    };

    return {
        get: function (key) {
            var path = 'settings.' + key,
                value = i18n.t(path, lookupOptions);

            if (value === lookupOptions.defaultValue) {
                var msg = 'settings: Key "' + key + '" unavailable';

                console.error(msg);
                console.trace();
                throw msg;
            }

            return value;
        }
    };
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
