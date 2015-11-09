// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-24 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/polyfills/util.js',

            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery-mousewheel/jquery.mousewheel.js',
            'bower_components/jquery-ui/jquery-ui.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',

            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-gridster/src/angular-gridster.js',
            'bower_components/i18next/i18next.js',
            'bower_components/ng-i18next/dist/ng-i18next.js',
            'bower_components/bootstrap/js/transition.js',
            'bower_components/angular-bootstrap/ui-bootstrap-.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-file-upload/angular-file-upload.min.js',
            'bower_components/angular-tree-control/angular-tree-control.js',

            'bower_components/paper/dist/paper-full.js',
            'bower_components/colpick/js/colpick.js',

            'app/lib/jquery-infobox/infobox.js',

            'app/app.js',
            'app/factories/**/*.js',
            //'app/factories/colpick.js',
            'app/pages/**/*.js',
            'app/pages/**/*.html',
            'app/directives/**/*.js',
            'app/directives/**/*.html',
            'app/services/**/*.js',
            'app/modals/**/*.js',
            'app/modals/**/*.html',

            {
                pattern: 'app/i18n/**/*.json',
                watched: true,
                served: true,
                included: false
            }
        ],

        preprocessors: {
            'app/modals/**/*.html': 'html2js',
            'app/pages/**/*.html': 'html2js',
            'app/directives/**/*.html': 'html2js',
            'app/i18n/*.json': 'ng-i18n',
            'app/directives/**/*.js':['coverage'],
            'app/modals/**/*.js':['coverage'],
            'app/factories/**/*.js':['coverage']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/'
        },

        ngi18nPreprocessor: {
            i18n: {
                "directory": "app/i18n/"
            }
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter',
            'karma-ng-html2js-preprocessor',
            'karma-ng-i18n-preprocessor'
        ],

        reporters: ['progress', 'junit', 'coverage'],

        coverageReporter:{
            type:'html',
            dir:'testresults/'
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
