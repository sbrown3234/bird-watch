(function() {

  var myApp = angular.module('imApp', ['app.routes', 'ui.router']);

  myApp.controller('mainController', ($scope, $http) => {
    $http.get('/images').then((results) => {
      if (!results) {
        $scope.images = 0
      } else {
        $scope.images = results.data;
      }
    })
  })

  myApp.controller('upload', ($scope, $http) => {
    $scope.title = '';
    $scope.username = '';
    $scope.file = {};
    $scope.observations = '';
    $scope.submit = () => {
      var file = $('input[type="file"]').get(0).files[0];
      var title = $scope.title;
      var username = $scope.username;
      var observations = $scope.observations;


      var formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('username', username)
      formData.append('observations', observations)

      $http({
        url: '/upload',
        method: 'POST',
        data: formData,
        headers: {'Content-Type': undefined},
        transformRequest: angular.indentify
      }).then(() => {
        $scope.title = '';
        $scope.username = '';
        $scope.file = {};
        $scope.observations = '';

      })

    }
  })

  myApp.controller('selected',  function($scope, $http, $stateParams) {

    $http.get('/images/'+ $stateParams.picId).then(({data}) => {
      getComments()
      $scope.image = data.image
    })

    $scope.username = '';
    $scope.comment = '';
    $scope.submit = () => {
      var username = $scope.username;
      var comment = $scope.comment;

      var commData = {};
      commData.username = username
      commData.comment = comment
      commData.imageId = $stateParams.picId

      console.log('comdata: ', commData)

      $http({
        url: 'images/' + $stateParams.picId  + '/comments/',
        method: "POST",
        data: commData
      }).then(() => {
        $scope.comment = '';
        $scope.username = '';
        getComments()
      }).catch((err) => {
        console.log('err in comment HTTPost: ', err)
      })
    }

    function getComments() {
      $http.get('/images/'+ $stateParams.picId).then(({data}) => {
        $scope.limit = 5;
        $scope.comments = data.comments;
        $scope.moreButton = "Load more comments..";
        if ($scope.limit < data.comments.length) {
          $('#more').css('visibility', 'visible');
        }
      $scope.moreComments = () => {
          $scope.limit += 5;
          if ($scope.limit >= data.comments.length) {
            $('#more').css('visibility', 'hidden');
          }
        };

      })
   }

  })


})();
