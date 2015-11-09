'use strict';

app.service('animationService', function ($q, $resource, settings) {

  function getAnimations() {
    var deferred = $q.defer();
    $resource(settings.get('rest.templ.animation-list')).get().then(function (data) {
      deferred.resolve(data);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  }

  function getAnimation(id) {
    return $resource(settings.get('rest.templ.animation-list')).get({id: id}).$promise;
  }

  function getLasforceAnimation(id) {
    return $resource(settings.get('rest.templ.lasforceanimation')).get({id:id}).$promise;
  }

  return {
    getAnimations: getAnimations,
    getAnimation: function (id) {
      return getAnimation(id);
    },
    getLasforceAnimation: function (id) {
      return getLasforceAnimation(id);
    }
  }
});
