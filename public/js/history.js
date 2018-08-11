/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller',[])
.controller('historyCtrl',function($scope,$location,$cookies,$http){
  $scope.user = $cookies.getObject('user');
  $scope.companyNames = Object.keys($scope.user.flag);
  $scope.companyName = 'all';
  $scope.siteName = 'all';
  $scope.deviceName = 'all';
  $scope.varAddr = 'all';
  $scope.table = [];


        $http.get('/api/addr').then((res) => {
            var result = res.data;
            if (result.status) {
                Object.keys(result.data).forEach((e) => {
                    $scope.table = $scope.table.concat(result.data[e]);
                })
            } else {
                alert('문제가 발생했습니다.\n다시 시도해주세요.\n문제가 반복되면 관리자에게 문의해주세요.')
            }
        });

  $scope.selectComp = (companyName) => {
      try {
          $scope.siteNames = Object.keys($scope.user.flag[companyName]);
      } catch (e) {}
  }

        $scope.selectSite = (siteName) => {
            try {
                $scope.deviceNames = Object.keys($scope.user.flag[$scope.companyName][siteName]);
            } catch (e) {}
        }

  var init = ()=>{
    if($location.absUrl().indexOf('login') > 0){
      angular.element('.navbar').hide();
      angular.element('.menu').css('visibility','hidden');
    }else{
      angular.element('.navbar').show();
      angular.element('.menu').css('visibility','visible');
    }

    angular.element('body').show();
  }
  init()
});