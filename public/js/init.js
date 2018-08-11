angular.module('steven',[
  'ngRoute',
  'oc.lazyLoad',
  'ngCookies'
  ]).config(['$routeProvider','$locationProvider',($routeProvider, $locationProvider)=>{
    $routeProvider
        .when('/login',{
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
        })
        .when('/',{
            templateUrl: '/html/index.html',
            controller: 'indexCtrl',
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'init First',
                        files: ['/lib/LineChart.min.js','/js/index.js']
                    }]);
                }]
            }
        })
        .when('/history',{
            templateUrl: '/html/history.html',
            controller: 'historyCtrl',
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'init First',
                        files: ['/js/history.js']
                    }]);
                }]
            }
        })
        .otherwise({redirectTo:'/login'});

        $locationProvider.hashPrefix('') 
        // $locationProvider.html5mode({ enabled: true, requireBase: true });

  }])
  .controller('headerCtrl',function($scope,$location,$cookies){
  $scope.user = $cookies.getObject('user');

  $scope.logout = () => {
    sessionStorage.clear();
    $cookies.remove('user');
    $location.path('/login')
  }

  var init = ()=>{
    if(!$scope.user){
      $location.path('/login')
    }
  }
  init()
})
.controller('menuCtrl',function($scope,$location,$cookies){
  $scope.user = $cookies.getObject('user');

  $scope.dropOpen = (e) => {
    var target = angular.element(e.target.nextElementSibling)
    if(target.css('display')=='none'){
      target.show()
    }else{
      target.hide()
    }
  }

  $scope.control = () => {
    var ip = sessionStorage.getItem('controlIp');
    if(!ip.startsWith('http')){
      ip = 'http://' + ip
    }
    window.open(ip,'_blank')
  }

});



