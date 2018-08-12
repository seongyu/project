/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller',[])
.controller('accountCtrl',function($scope,$location,$cookies,$http){
  $scope.moment = moment;

  $scope.user = $cookies.getObject('user');
  $scope.target = $cookies.getObject('target');
  $scope.flag = {};
  $scope.role = {};
  $scope.action = '계정생성'
  $scope.update = false;

  $scope.companyNames = Object.keys($scope.user.flag);
  $scope.companyName = 'all';
  $scope.siteNames = [];
  $scope.deviceNames = [];
  $scope.siteFlag = {};
  $scope.deviceFlag = {};

  if($scope.target&&$scope.target.role.indexOf('admin')>=0){
    alert('설정을 변경할 수 없는 계정입니다.');
    $location.path('/');
  }else if($scope.target){
    $scope.action = '계정변경';
    $scope.update = true;
    $scope.id = $scope.target.id;
    $scope.companyName = $scope.target.companyName;
    $scope.flag = $scope.target.flag;
    $scope.role = $scope.setRole($scope.target.role)
  };

  $scope.selectComp = (companyName) => {
    $scope.siteNames = [];
    $scope.deviceNames = [];
    $scope.siteFlag = {};
    $scope.deviceFlag = {};
      try {
          $scope.siteNames = Object.keys($scope.user.flag[companyName]);
      } catch (e) {};
    if($scope.flag[companyName]){
      Object.keys($scope.flag[companyName]).forEach((e)=>{
        $scope.siteFlag[e] = true;
      })
    };
  }

  $scope.setRole = (role) => {
    $scope.role = {
      mon : indexOf('mon')>=0 ? true : false,
      his : indexOf('his')>=0 ? true : false,
      con : indexOf('con')>=0 ? true : false,
      set : indexOf('set')>=0 ? true : false
    }
  }

  $scope.selectSite = (siteName,isAdd) => {
    try {
      var arr = Object.keys($scope.user.flag[$scope.companyName][siteName]);
      if(isAdd){
        $scope.deviceNames = $scope.deviceNames.concat(arr);
      }else{
        $scope.deviceNames = $($scope.deviceNames).not(arr);
        $scope.deviceNames.length==0?$scope.deviceNames = []:null;
      }
    } catch (e) {console.log(e)};
    if($scope.flag[$scope.companyName]&&$scope.flag[$scope.companyName][siteName]){
      Object.keys($scope.flag[$scope.companyName][siteName]).forEach((e)=>{
        $scope.deviceFlag[e] = true;
      })
    };
  };

  $scope.setFlag = (siteName,deviceName,YN) =>{
   if(!YN){
    delete $scope.deviceFlag[siteName][deviceName]
   }
  }

  $scope.save = () => {
    if(!$scope.id||$scope.id==''||!$scope.password||$scope.password==''){
      return alert('필수정보가 누락되어있습니다.\n입력내용을 확인하세요.')
    };
    if(!$scope.companyName||$scope.companyName==''||$scope.companyName=='all'){
      return alert('업체를 선택하지 않으셨습니다.\n입력내용을 확인하세요.')
    }

    var flag = {};
    flag[$scope.companyName] = $scope.deviceFlag;
    var role = '';
    Object.keys($scope.role).forEach((e)=>{
      $scope.role[e] ? role = role + e + '/' : null;
    });
    role = role.slice(0,-1);

    var user = {
      flag : JSON.stringify(flag),
      role : role,
      id : $scope.id,
      companyName : $scope.companyName,
      password : $scope.password
    };
    var uri = '/api/user';
    if($scope.update){
      uri = '/api/user/update';
    }
    $http.post(uri,user)
    .then((res)=>{
      var result = res.data;
      if(result.status){
        alert('성공적으로 저장하였습니다.');
      }else{
        alert('저장에 실패하였습니다.\n다시 시도해주세요.\n문제가 지속적으로 반복된다면 관리자에게 문의해주세요.');
      }
    })
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