app.controller('animationCtrl', function ($scope, $rootScope, $http, settings) {
    paper.install(window);
    paper.setup('CanvasAnimation');

    $scope.animations;
    $scope.selectedAnimation;
    $scope.name;
    $scope.nrOfFrames = 0;
    $scope.frames = new Array();
    var viewPortMiddle = 326;
    var zoom = Settings.Zoom;

    $http({method: 'GET', url: settings.get('rest.templ.animationList')}).
        success(function (data, status, headers, config) {
            console.log(data);
            $scope.animations = data;
        }).
        error(function (data, status, headers, config) {
            throw {
                message: 'Could not collected animations from server',
                status: status
            }
        });

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function addChild(child) {
        var type = child[0];
        var childItem = child[1];
        if (type == 'Path') {
            var path = new paper.Path();
            path.segments = childItem.segments;
            path.strokeColor = childItem.strokeColor;
            path.strokeWidth = childItem.strokeWidth;
            path.closed = childItem.closed;
            return path;
        }
        if (type == 'Group') {
            var group = new paper.Group();
            group.applyMatrix = child.applyMatrix;
            var children = new Array();
            for(var i=0;i<childItem.children.length;i++) {
                children[i] = addChild(childItem.children[i]);
            }
            group.children = children;
            return group;
        }
        if (type == 'PointText') {
            var pointText = new paper.PointText();
            pointText.applyMatrix = childItem.applyMatrix;
            pointText.content = childItem.content;
            pointText.fillColor = childItem.fillColor;
            pointText.font = childItem.font;
            pointText.fontFamily = childItem.fontFamily;
            pointText.fontSize = childItem.fontSize;
            pointText.fontWeight = childItem.fontWeight;
            pointText.leading = childItem.leading;
            pointText.matrix = childItem.matrix;
            return pointText;
        }
    }

    $scope.loadAnimation = function (name) {
        console.log('Loading animation: ' + name);
        project.clear();
        paper.view.draw();
        $http({method: 'GET', url: 'rest/animation/load/' + name}).
            success(function (data) {
                console.log(data);
                paper.project.clear();
                $scope.frames = new Array();
                $scope.selectedAnimation = data;
                var layers = data.layers;
                $scope.nrOfFrames = layers.length;
                $scope.name = data.name;
                if ($scope.name == undefined) {
                    $scope.name = name;
                }
                var layer;
                for (var i = 0; i < layers.length; i++) {
                    layer = new paper.Layer();
                    layer.name = layers[i][1].name;
                    layer.visible = layers[i][1].visible;
                    for (var j = 0; j < layers[i][1].children.length; j++) {
                        var child = layers[i][1].children[j];
                        addChild(child);
                    }
                    project.layers[i].visible = false;
                    $scope.frames[i] = layer;
                }
                project.layers[0].visible = true;
                $rootScope.currentFrame = 0;
                paper.view.draw();
            })
    }
});