angular.module('steven',[
  'ngRoute',
  'oc.lazyLoad'
  ]).config(['$routeProvider','$locationProvider',($routeProvider, $locationProvider)=>{
    $routeProvider
        .when('/',{
            templateUrl: '/html/login.html',
            controller: 'loginCtrl',
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'init First',
                        files: ['/js/login.js']
                    }]);
                }]
            }
        });

        $locationProvider.hashPrefix('');
  }])