var $timeout, $interval, $compile, $scope, $rootScope, $httpBackend, animations, userSettings;

var i18nextOptions = {
    resGetPath : 'base/app/i18n/locale-__lng__.json',
    lng : 'en',
    useCookie: false,
    useLocalStorage: false,
    useDataAttrOptions: false,
    fallbackLng : 'en',
    dynamicLoad: false,
    getAsync : false,
    debug : true
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

function removeLineFeeds(str) {
    return str.replace(/\s\s+/g, ' ');
}

var pointMatcher = {
    toEqualPoint: function() {
        return {
            compare: function(actual, expected) {
                var result = {};
                if (actual === undefined && expected === undefined) {
                    result.pass= true;
                    result.message = 'Both points are undefined';
                }
                if (actual === undefined || expected === undefined) {
                    result.pass = false;
                    result.message = 'Points are not equal. (one of them is undefined)';
                }
                result.pass = true;
                result.message = 'Both points are the same';
                if (actual.x !== expected.x) {
                    result.pass = false;
                    result.message = 'X axis of the points don\'t match (actual=' + actual.x + ', expected=' + expected.x + ')';
                }
                if (actual.y !== expected.y) {
                    var message = 'Y axis of the points don\'t match (actual=' + actual.y + ', expected=' + expected.y + ')';
                    if (result === false) {
                        result.message += '\n' + message;
                    } else {
                        result.message = message;
                    }
                    result.pass = false;
                }
                return result;
            }
        }
    }
};

function setup(template, directives) {
    module('lasforceApp', function($provide) {
        if (angular.isDefined(directives)) {
            if ($.isArray(directives)) {
                angular.forEach(directives, function (directive) {
                    $provide.factory(directive + 'Directive', function () {
                        return {replace: true, template: '<div id="' + directive + '">*** Mock ****</div>'};
                    });
                });
            } else {
                $provide.factory(directives + 'Directive', function () {
                    return {replace: true, template: '<div id="' + directives + '">*** Mock ****</div>'};
                });
            }
        }
    });

    module('jm.i18next', function ($i18nextProvider) {
        $i18nextProvider.options = i18nextOptions;
    });

    if (angular.isDefined(template)) {
        // Load needed html files.
        if ($.isArray(template)) {
            angular.forEach(template, function (temp) {
                module(temp);
            })
        } else {
            module(template);
        }
    }

    inject(function (_$compile_, _$rootScope_, _$httpBackend_, _$timeout_, _$interval_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $interval = _$interval_;
    });
    jasmine.addMatchers(pointMatcher);
}

function compileDirective(directive) {
    var element = angular.element(directive);
    var compiledElement = $compile(element)($scope);
    $scope.$digest();
    return compiledElement;
}

function waitForBackdropAnimation() {
    inject(function ($transition) {
        if ($transition.transitionEndEventName) {
            $timeout.flush();
        }
    });
}

function removePreviousModal() {
    var body = angular.element(document.body);
    var modal = body.find('div.modal-dialog');
    if (angular.isDefined(modal)) {
        modal.remove();
    }
}

function createFakePaperElement(name) {
    return {name:name, parent: {segments: [], add:function(point) {}}, item: {remove: function () {}, point: function() {}}};
}
/*
 * PhantomJS doesn't provide an implementation of bind - this polyfill from:
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
 *
 * is an acceptable workaround when running tests.
 */

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        'use strict';
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        FNOP.prototype = this.prototype;
        fBound.prototype = new FNOP();

        return fBound;
    };
}

animations = [
    {id:1, name: 'animation_1'},
    {id:2, name: 'animation_2'},
    {id:3, name: 'animation_3'},
    {id:4, name: 'animation_4'}
];

userSettings = {
    framerate: 20,
    loopCount: 1,
    color: '#123123'
}