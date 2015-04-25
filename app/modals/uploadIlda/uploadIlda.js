'use strict';

app.controller('uploadIldaCtrl', function($scope, settings, FileUploader, $modalInstance) {
  var uploader = $scope.uploader = new FileUploader({
    url: settings.get('rest.templ.animationUpload')
  });

  $scope.close = function() {
    $modalInstance.close();
  }

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      return this.queue.length < 10;
    }
  });

  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };

  console.info('uploader', uploader);
});

app.factory('uploadIldaFactory', function ($modal) {

  //var uploadIldaCtrl = function ($scope, $modalInstance) {
  //
  //  $scope.upload = function () {
  //    $modalInstance.close();
  //  }
  //
  //  $scope.close = function () {
  //    $modalInstance.close();
  //  }
  //};
  //
  var openUploadFileModal = function () {
    console.log('Upload ilda selected');
    return $modal.open({
      templateUrl: '/modals/uploadIlda/uploadIlda.html',
      controller: 'uploadIldaCtrl'
    });
  }

  return {
    openUploadFileModal: function () {
      return openUploadFileModal();
    }
  };

})
