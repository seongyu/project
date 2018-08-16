angular.module('steven', [
        'ngRoute',
        'oc.lazyLoad',
        'ngCookies'
    ]).run(($location,$rootScope)=>{
        $rootScope.$on('$locationChangeSuccess',(e,newL,oldL) => {
            $rootScope.$broadcast('refreshHead');
            $rootScope.$broadcast('refreshMenu');
        });
    }).config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
        $routeProvider
            .when('/login', {
                templateUrl: '/html/login.html',
                controller: 'loginCtrl',
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'init First',
                            files: ['/js/login.js']
                        }]);
                    }]
                }
            })
            .when('/', {
                templateUrl: '/html/index.html',
                controller: 'indexCtrl',
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'init First',
                            files: ['/lib/LineChart.min.js', '/js/index.js']
                        }]);
                    }]
                }
            })
            .when('/history', {
                templateUrl: '/html/history.html',
                controller: 'historyCtrl',
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'init First',
                            files: ['/js/history.js']
                        }]);
                    }]
                }
            })
            .when('/setting', {
                templateUrl: '/html/setting.html',
                controller: 'settingCtrl',
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'init First',
                            files: ['/js/setting.js']
                        }]);
                    }]
                }
            })
            .when('/account', {
                templateUrl: '/html/account.html',
                controller: 'accountCtrl',
                resolve: {
                    lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'init First',
                            files: ['/js/account.js']
                        }]);
                    }]
                }
            })
            .otherwise({ redirectTo: '/login' });

        $locationProvider.hashPrefix('')
        // $locationProvider.html5mode({ enabled: true, requireBase: true });

    }])
    .controller('headerCtrl', function($scope, $location, $cookies, $rootScope) {
        $scope.user = $cookies.getObject('enesUser');

        $rootScope.$on('refreshHead',()=>{
            $scope.user = $cookies.getObject('enesUser');
        });

        $scope.logout = () => {
            sessionStorage.clear();
            $cookies.remove('enesUser');
            localStorage.removeItem('flag');
            $location.path('/login')
        }

        var init = () => {
            if (!$scope.user) {
                $location.path('/login')
            }
        }
        init()
    })
    .controller('menuCtrl', function($scope, $location, $cookies, $rootScope) {
        $scope.user = $cookies.getObject('enesUser');

        $rootScope.$on('refreshMenu',()=>{
            $scope.user = $cookies.getObject('enesUser');
        });

        $scope.dropOpen = (e) => {
            var target = angular.element(e.target.nextElementSibling)
            if (target.css('display') == 'none') {
                target.show()
            } else {
                target.hide()
            }
        }

        $scope.control = () => {
            var ip = localStorage.getItem('controlIp');

            if (!ip || ip == '' || ip == 'null') {
                return alert('컨트롤 IP가 설정되어있지 않습니다.\n설정내용을 확인해주세요.');
            }
            if (!ip.startsWith('http')) {
                ip = 'http://' + ip
            }
            window.open(ip, '_blank')
        }

    });