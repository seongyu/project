/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller',[])
.controller('settingCtrl',function($scope,$location,$cookies){
  $scope.user = $cookies.getObject('user');
  

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