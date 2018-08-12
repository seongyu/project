/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller', [])
    .controller('loginCtrl', function($scope, $location, $http, $cookies) {

        $scope.login = () => {
            sessionStorage.setItem('id', $scope.id);
            sessionStorage.setItem('password', $scope.password);
            sessionStorage.setItem('controlIp', $scope.control_ip);

            $http.post('/api/login', {
                id: $scope.id,
                password: $scope.password
            }).then((result) => {
                if (result.data.status) {
                    $cookies.putObject('user', result.data.data);
                    $location.path('/');
                } else {
                    alert('아이디나 패스워드가 틀렸습니다.\n다시한번 확인해주세요.');
                    sessionStorage.removeItem('id');
                    sessionStorage.removeItem('password');
                }
            })
        }

        $scope.setAutoLogin = (auto_login) => {
            sessionStorage.setItem('autoLogin', auto_login);
        }

        var init = () => {
            $scope.auto_login = sessionStorage.getItem('autoLogin') == 'true' ? true : false;

            $scope.control_ip = sessionStorage.getItem('control_ip') ? sessionStorage.getItem('control_ip') : null;

            if ($scope.auto_login) {
                $scope.id = sessionStorage.getItem('id') ? sessionStorage.getItem('id') : null;
                $scope.password = sessionStorage.getItem('password') ? sessionStorage.getItem('password') : null;
                $scope.login();
            }

            if ($location.absUrl().indexOf('login') > 0) {
                angular.element('.navbar').hide();
                angular.element('.menu').css('visibility', 'hidden');
            }

            angular.element('body').show();
        }

        init()
    });