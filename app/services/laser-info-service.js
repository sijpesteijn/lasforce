'use strict';

app.service('laserStatusService', ['$resource','settings', function($resource, settings, $q) {

  this.get = function() {
    var deferred = $q.defer();
    $resource(settings.get('rest.templ.laser')).get().then(function(data) {
      deferred.resolve(data);
    }, function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  this.post = function(laserStatus) {
    var deferred = $q.defer();
    $resource(settings.get('rest.templ.laser')).post(laserStatus).then(function(data) {
      deferred.resolve(data);
    }, function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

}]);
