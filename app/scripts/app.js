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
    'jm.i18next',
    'ui.bootstrap',
    'angularFileUpload'
  ]);
//  .config(function ($routeProvider) {
//    $routeProvider
//      .when('/', {
//        templateUrl: 'views/main.html',
//        controller: 'MainCtrl'
//      })
//      .when('/about', {
//        templateUrl: 'views/about.html',
//        controller: 'AboutCtrl'
//      })
//      .otherwise({
//        redirectTo: '/'
//      });
//  });

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