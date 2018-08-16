/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller', [])
    .controller('settingCtrl', function($scope, $location, $cookies, $http, $timeout) {
        $scope.moment = moment;

        $scope.user = $cookies.getObject('enesUser');
        try{
            $scope.flag = JSON.parse(localStorage.getItem('flag'))
        }catch(e){
            alert('접근권한을 구축하는데 오류가 발생했습니다.\n다시 로그인해주세요.')
        };

        $scope.companyNames = Object.keys($scope.flag);
        $scope.companyName = 'all';

        $scope.search = () => {
            var param = $scope.companyName ? $scope.companyName : 'all';
            $http.get('/api/users/' + param)
                .then((res) => {
                    var result = res.data;
                    if (result.status && result.data.length > 0) {
                        $scope.accounts = result.data;
                    } else {
                        alert('검색조건에 해당하는 정보가 없습니다.')
                    }
                });
        }

        $scope.add = (target) => {
            if (target) {
                sessionStorage.setItem('flag',JSON.stringify(target.flag));
                delete target.flag;
                delete target.password;

                $cookies.putObject('enesTarget', target);
            } else {
                $cookies.remove('enesTarget');
            }
            $timeout((e)=>{
                $location.path('/account');
            },300);
        }

        $scope.getRole = (role) => {
            var rolestring = '';
            var str = role
                .replace('mon', '실시간모니터링')
                .replace('his', '상태히스토리')
                .replace('con', '원격컨트롤')
                .replace('set', '설정');
            if (role.indexOf('admin') >= 0) {
                str = '실시간모니터링/상태히스토리/원격컨트롤/설정'
            };
            return str
        }

        var init = () => {
            if ($scope.user.role.indexOf('admin') < 0) {
                $scope.companyName = $scope.user.companyName;
                $('#adonly').remove();
            }

            if ($location.absUrl().indexOf('login') > 0) {
                angular.element('.navbar').hide();
                angular.element('.menu').css('visibility', 'hidden');
            } else {
                angular.element('.navbar').show();
                angular.element('.menu').css('visibility', 'visible');
            }

            angular.element('body').show();
        }
        init()
    });