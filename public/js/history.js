/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller', ['daterangepicker'])
    .controller('historyCtrl', function($scope, $location, $cookies, $http,$window) {
      $scope.user = $cookies.getObject('user');
        $scope.companyNames = Object.keys($scope.user.flag);
        if($scope.user.role.indexOf('admin')<0){
          $scope.companyName = $scope.user.companyName;
          $('#adonly').remove();
        }else{
          $scope.companyName = 'all';
        }
        $scope.siteName = 'all';
        $scope.deviceName = 'all';
        $scope.varAddr = 'all';
        $scope.history = [];
        $scope.table = [];
        $scope.moment = moment;
        var _devLst = [];

        Object.keys($scope.user.flag[$scope.companyName]).forEach((e)=>{
          _devLst = _devLst.concat(Object.keys($scope.user.flag[$scope.companyName]['LeonTest']));
        })

      $('#dateRange').daterangepicker({
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, (from,to)=>{
      console.log($scope.date)
    });
        
        var _bodyCreate = () => {
          var param = {}
          try{
            var _date = $scope.date.split(' - ');
            $scope.startDate = moment(new Date(_date[0])).format('YYYY-MM-DD HH:mm:ss');
            $scope.endDate = moment(new Date(_date[1])).format('YYYY-MM-DD HH:mm:ss');
          }catch(e){}
          
          param = {
            startDate : $scope.startDate? $scope.startDate : moment().hour(0).format('YYYY-MM-DD HH:mm:ss'),
            endDate : $scope.endDate? $scope.endDate : moment().hour(23).format('YYYY-MM-DD HH:mm:ss')
          }
          

          !$scope.companyName||$scope.companyName=='all'? null : param.companyName = $scope.companyName;
          !$scope.siteName||$scope.siteName=='all'? null : param.siteName = $scope.siteName;
          !$scope.deviceName||$scope.deviceName=='all'? null : param.deviceName = $scope.deviceName;
          !$scope.varAddr||$scope.varAddr=='all'? null : param.varAddr = $scope.varAddr;

          return param;
        }

        $scope.download = () => {
          var param = _bodyCreate();

          $http.post('/api/history/excel',param,{ responseType: "blob" })
          .then((res)=>{
            try{
              var blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              },
              "excel.xlsx");
              window.location=window.URL.createObjectURL(blob);  
            }catch(e){
              alert('추출할 데이터가 없거나 잘못된 데이터입니다.\n다시 확인해주세요.')
            }
          })
        }

        $scope.search = () => {
          var param = _bodyCreate();

          $http.post('/api/history',param)
          .then((res)=>{
            console.log(res)
            var result = res.data;

            if(result.status){
              $scope.history = result.data.filter((e)=>{
                return _devLst.find((j)=>{return j==e.deviceName})
              })
            }
          })
        }

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

        var init = () => {
        $scope.selectComp($scope.companyName);
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