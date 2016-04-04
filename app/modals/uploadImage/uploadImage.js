'use strict';

app.controller('uploadImageCtrl', function($scope, $timeout, $uibModalInstance) {
  var image_matrix, columns, rows;
  $scope.loaded = false;
  $scope.options = { low_threshold: 40, high_threshold: 50, blur_radius: 0};

  $timeout(function() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    $("#thresholds").slider({
      range: true,
      min: 0,
      max: 127,
      values: [ $scope.options.low_threshold, $scope.options.high_threshold ],
      slide: function( event, ui ) {
        $scope.options.low_threshold = ui.values[ 0 ];
        $scope.options.high_threshold =ui.values[ 1 ];
        $scope.$apply();
        cannyImage();
      }
    });
    $("#blurradius").slider({
      min: 0,
      max: 4,
      value: $scope.options.blur_radius,
      slide: function( event, ui ) {
        $scope.options.blur_radius = ui.values[ 0 ];
        $scope.$apply();
        cannyImage();
      }
    });
  });

  $scope.close = function() {
    $uibModalInstance.close();
  };

  $scope.ok = function() {
    //var i = image_matrix.cols*image_matrix.rows, pix = 0;
    //while(--i >= 0) {
    //  pix = image_matrix.data[i];
    //  //console.log(pix);
    //}
    //$uibModalInstance.dismiss()
    var canvas = document.getElementById("imageUpload");
    var svg = document.getElementById("svgUpload");
    importCanvas(canvas, svg);
  };

  function importCanvas(sourceCanvas, targetSVG) {
    // get base64 encoded png data url from Canvas
    var img_dataurl = sourceCanvas.toDataURL("image/png");

    var svg_img = document.createElementNS(
      "http://www.w3.org/2000/svg", "image");

    svg_img.setAttributeNS(
      "http://www.w3.org/1999/xlink", "xlink:href", img_dataurl);

    targetSVG.appendChild(svg_img);
  }

  function cannyImage() {
    var canvas = document.getElementById("imageUpload");
    canvas.width = columns;
    canvas.height = rows;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.strokeWidth = 5;
    ctx.drawImage(document.getElementById('theimage'), 0,0, columns, rows);

    image_matrix = new jsfeat.matrix_t(columns, rows, jsfeat.U8_t | jsfeat.C1_t);
    var imageData = ctx.getImageData(0, 0, columns, rows);
    jsfeat.imgproc.grayscale(imageData.data, columns, rows, image_matrix);
    var r = $scope.options.blur_radius|0;
    var kernel_size = (r+1) << 1;
    jsfeat.imgproc.gaussian_blur(image_matrix, image_matrix, kernel_size, 0);
    jsfeat.imgproc.canny(image_matrix, image_matrix, $scope.options.low_threshold|0, $scope.options.high_threshold|0);

    var data_u32 = new Uint32Array(imageData.data.buffer);
    var alpha = (0xff << 24);
    var i = image_matrix.cols*image_matrix.rows, pix = 0;
    while(--i >= 0) {
      pix = image_matrix.data[i];
      //if (pix) {
      data_u32[i] = alpha | (0 << 16) | (0 << 8) | pix;
      // Sets ALPHA and RED channel bytes each to 256
      //}
    }

    ctx.putImageData(imageData, 0, 0);
    console.log('Finished edge detection');
    $scope.loaded = true;
    $scope.$apply();
  }

  function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img  id="theimage" style="border: 1px solid black" src="', e.target.result,
          '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('originalImage').innerHTML = '';
        document.getElementById('originalImage').insertBefore(span, null);
        var image = document.getElementById('theimage');
        columns = image.width;
        rows = image.height;
        cannyImage();
      };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
  }

});

app.factory('uploadImageFactory', function($modal) {

  var openModal = function () {
    console.log('Upload image selected');
    return $modal.open({
      windowClass: 'uploadImage',
      templateUrl: '/modals/uploadImage/uploadImage.html',
      controller: 'uploadImageCtrl'
    });
  };

  return {
    openModal: function() {
      return openModal();
    }
  }
});

app.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          if (attrs.multiple) {
            modelSetter(scope, element[0].files);
          }
          else {
            modelSetter(scope, element[0].files[0]);
          }
        });
      });
    }
  }
}]);
