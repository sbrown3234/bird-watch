(function() {
  angular.module('app.routes', ['ui.router'])

  .config(($stateProvider, $locationProvider) => {
    $locationProvider.hashPrefix('');
    $stateProvider

    .state('home', {
      url: '/',
    })

    .state('image', {
      url: '/images/:picId',
      views: {
        'image': {
          templateUrl: 'app/views/clicked.html',
          controller: function($stateParams){
            console.log('stateParams: ', $stateParams.picId)
            return $stateParams
          }
        }
      }
    })


  })
})()
