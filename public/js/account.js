/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller', [])
    .controller('accountCtrl', function($scope, $location, $cookies, $timeout, $http) {
        $scope.moment = moment;

        $scope.user = $cookies.getObject('enesUser');
        $scope.target = $cookies.getObject('enesTarget');
        $scope.targetFlag = {};
        $scope.role = {};
        $scope.action = '계정생성';
        $scope.update = false;

        try{
            $scope.flag = JSON.parse(localStorage.getItem('flag'))
        }catch(e){
            alert('접근권한을 구축하는데 오류가 발생했습니다.\n다시 로그인해주세요.')
        };

        $scope.companyNames = Object.keys($scope.flag);
        $scope.companyName = 'all';
        $scope.siteNames = [];
        $scope.deviceNames = [];
        $scope.siteFlag = {};
        $scope.deviceFlag = {};

        $scope.selectComp = (companyName) => {
            $scope.siteNames = [];
            $scope.deviceNames = [];
            $scope.siteFlag = {};
            $scope.deviceFlag = {};
            try {
                $scope.siteNames = Object.keys($scope.flag[companyName]);
            } catch (e) {};
            if ($scope.targetFlag[companyName]) {
                Object.keys($scope.targetFlag[companyName]).forEach((e) => {
                    $scope.siteFlag[e] = true;
                })
            };
        }

        $scope.setRole = (role) => {
            $scope.role = {};
            $scope.role['mon'] = role.indexOf('mon') >= 0 ? true : false;
            $scope.role['his'] = role.indexOf('his') >= 0 ? true : false;
            $scope.role['con'] = role.indexOf('con') >= 0 ? true : false;
            $scope.role['set'] = role.indexOf('set') >= 0 ? true : false;
        }

        $scope.selectSite = (siteName, isAdd) => {
            try {
                var arr = Object.keys($scope.flag[$scope.companyName][siteName]);
                if (isAdd) {
                    $scope.deviceNames = $scope.deviceNames.concat(arr);
                } else {
                    $scope.deviceNames = $($scope.deviceNames).not(arr);
                    $scope.deviceNames.length == 0 ? $scope.deviceNames = [] : null;
                }
            } catch (e) { console.log(e) };
            if ($scope.targetFlag[$scope.companyName] && $scope.targetFlag[$scope.companyName][siteName]) {
                Object.keys($scope.targetFlag[$scope.companyName][siteName]).forEach((e) => {
                    $scope.deviceFlag[e] = true;
                })
            };
        };

        $scope.test = () => {console.log($scope.role)};

        $scope.setFlag = (siteName, deviceName, YN) => {
            if (!YN) {
                delete $scope.deviceFlag[siteName][deviceName]
            }
        }

        $scope.save = () => {
            if (!$scope.id || $scope.id == '') {
                return alert('필수정보가 누락되어있습니다.\n입력내용을 확인하세요.')
            };

            if(!$scope.update && (!$scope.password || $scope.password == '')){
                return alert('필수정보가 누락되어있습니다.\n입력내용을 확인하세요.')  
            }
            
            if (!$scope.companyName || $scope.companyName == '' || $scope.companyName == 'all') {
                return alert('업체를 선택하지 않으셨습니다.\n입력내용을 확인하세요.')
            }

            var flag = {};
            flag[$scope.companyName] = $scope.deviceFlag;
            var role = '';
            Object.keys($scope.role).forEach((e) => {
                $scope.role[e] ? role = role + e + '/' : null;
            });
            role = role.slice(0, -1);

            var user = {
                flag: JSON.stringify(flag),
                role: role,
                id: $scope.id,
                companyName: $scope.companyName
            };

            $scope.password&&$scope.password!=''? user.password = $scope.password : null;

            var uri = '/api/user';
            if ($scope.update) {
                uri = '/api/user/update';
            }
            $http.post(uri, user)
                .then((res) => {
                    var result = res.data;
                    if (result.status) {
                        alert('성공적으로 저장하였습니다.');
                        $cookies.remove('enesTarget');
                        $timeout((e)=>{
                            $location.path('/setting');
                        });
                    } else {
                        alert('저장에 실패하였습니다.\n다시 시도해주세요.\n문제가 지속적으로 반복된다면 관리자에게 문의해주세요.');
                    }
                })
        }

        var init = () => {

            if ($scope.target && $scope.target.role.indexOf('admin') >= 0) {
                alert('설정을 변경할 수 없는 계정입니다.');
                $location.path('/');
            } else if ($scope.target) {
                $scope.action = '계정변경';
                $scope.update = true;
                $scope.id = $scope.target.id;
                $scope.companyName = $scope.target.companyName;
                $scope.targetFlag = JSON.parse(sessionStorage.getItem('flag'));
                $scope.setRole($scope.target.role);
                $scope.selectComp($scope.companyName);
            };

            if ($location.absUrl().indexOf('login') > 0) {
                angular.element('.navbar').hide();
                angular.element('.menu').css('visibility', 'hidden');
            } else {
                angular.element('.navbar').show();
                angular.element('.menu').css('visibility', 'visible');
            }

            angular.element('body').show();
        }
        init();
    });