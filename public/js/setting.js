/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller',[])
.controller('settingCtrl',function($scope,$location,$cookies,$http){
  $scope.moment = moment;

  $scope.user = $cookies.getObject('user');
  $scope.companyNames = Object.keys($scope.user.flag);
  $scope.companyName = 'all';

  $scope.search = () => {
    var param = $scope.companyName? $scope.companyName : 'all';
    $http.get('/api/users/'+param)
    .then((res)=>{
      var result = res.data;
      if(result.status&&result.data.length>0){
        $scope.accounts = result.data;
      }else{
        alert('검색조건에 해당하는 정보가 없습니다.')
      }
    });
  }

  $scope.add = (target) => {
    if(target){
      $cookies.putObject('target',target);
    }else{
      $cookies.remove('target');
    }
    $location.path('/account');
  }

  $scope.getRole = (role)=> {
    var rolestring = '';
    var str = role
    .replace('mon','실시간모니터링')
    .replace('his','상태히스토리')
    .replace('con','원격컨트롤')
    .replace('set','설정');
    if(role.indexOf('admin')>=0){
      str = '실시간모니터링/상태히스토리/원격컨트롤/설정'
    };
    return str
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