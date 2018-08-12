/**
 * Created by LeonKim on 18.07.28
 */
angular.module('steven.controller', ['n3-line-chart'])
    .controller('indexCtrl', function($scope, $location, $cookies, $http, $interval) {
        $scope.user = $cookies.getObject('user');
        $scope.companyNames = Object.keys($scope.user.flag);
        $scope.siteNames = [];
        $scope.deviceNames = [];
        $scope.svs = [];
        $scope.conpare = [];
        $scope.inlineTable = [];
        $scope.conpareBox = _dataModel();;
        $scope.data = _dataModel();
        $scope.options = _optionModel();

        var _trigger = () => {
            angular.element('.index').find('tr').each((i, e) => {
                $(e).find('td').eq(1).html('');
                $(e).find('td').eq(2).html('');
            });
            $scope.svs = [];
        }

        $http.get('/api/addr').then((res) => {
            var result = res.data;
            if (result.status) {
                $scope.table = result.data;
                Object.keys($scope.table).forEach((e) => {
                    $scope.inlineTable = $scope.inlineTable.concat($scope.table[e]);
                })
            } else {
                alert('문제가 발생했습니다.\n다시 시도해주세요.\n문제가 반복되면 관리자에게 문의해주세요.')
            }
        });

        var _device_monitor = () => {
            if ($scope.companyName && $scope.siteName && $scope.deviceName) {
                var param = {
                    companyName: $scope.companyName,
                    siteName: $scope.siteName,
                    deviceName: $scope.deviceName
                }
                $http.post('/api/monitor/device', param)
                    .then((res) => {
                        var result = res.data;
                        if (result.status) {
                            result.data.forEach((e) => {
                                var target = angular.element('.index').find('#' + e.varAddr + ' td');
                                if (target.length > 0) {
                                    target.eq(1).html(e.varLabel);
                                    target.eq(2).html(e.varStatus);
                                } else {
                                    $scope.svs.push(e);
                                }
                                var conpare = Object.values($scope.conpareBox).find((j) => { return j == e.moduleSeq });
                                if (conpare) {
                                    _apply_graph(e);
                                }
                            })
                        }
                    })
            }
        }

        $scope.setDataset = (moduleSeq, setNo) => {
            $scope.conpareBox[setNo] = moduleSeq;
            $scope.data = _dataModel();
        }

        _apply_graph = (log) => {
            Object.keys($scope.conpareBox).forEach((setName) => {
                if ($scope.conpareBox[setName] == log.moduleSeq) {
                    var val = {
                        x: new Date(),
                        varStatus: parseInt(log.varStatus)
                    };
                    $scope.data[setName].push(val);

                    if ($scope.data[setName].length > 20) {
                        $scope.data[setName].shift();
                    }
                }
            })
        }

        $scope.getShortName = (lb) => {
            return $scope.inlineTable.find((e) => { return e.varAddr == lb })
        }

        $scope.selectComp = (companyName) => {
            try {
                $scope.siteNames = Object.keys($scope.user.flag[companyName]);
                if ($scope.siteNames.length > 0) {
                    angular.element('#siteform').show()
                }
            } catch (e) {
                angular.element('#siteform').hide()
            }
            _trigger();
        }

        $scope.selectSite = (siteName) => {
            try {
                $scope.deviceNames = Object.keys($scope.user.flag[$scope.companyName][siteName]);
                if ($scope.deviceNames.length > 0) {
                    angular.element('#deviceform').show()
                }
            } catch (e) {
                angular.element('#deviceform').hide()
            }
            _trigger();
        }

        $scope.selectDevice = (deviceName) => {
            _trigger();
            if (deviceName && deviceName != '') {
                var param = {
                    companyName: $scope.companyName,
                    siteName: $scope.siteName,
                    deviceName: $scope.deviceName
                }
                $http.post('/api/monitor/device', param)
                    .then((res) => {
                        var result = res.data;
                        if (result.status) {
                            $scope.conpare = result.data;
                            result.data.forEach((e) => {
                                var target = angular.element('.index').find('#' + e.varAddr + ' td');
                                if (target.length > 0) {
                                    target.eq(1).html(e.varLabel);
                                    target.eq(2).html(e.varStatus);
                                } else {
                                    $scope.svs.push(e);
                                }
                            })
                        }
                    })
            }
        };

        var init = () => {

            if ($scope.user.role.indexOf('admin') < 0) {
                $scope.companyName = $scope.user.companyName;
                $scope.selectComp($scope.companyName);
            }
            if ($location.absUrl().indexOf('login') > 0) {
                angular.element('.navbar').hide();
                angular.element('.menu').css('visibility', 'hidden');
            } else {
                angular.element('.navbar').show();
                angular.element('.menu').css('visibility', 'visible');
            }

            $interval(() => {
                _device_monitor();
            }, 1000);

            angular.element('body').show();
        }

        init()
    });



var _dataModel = () => {
    return {
        dataset0: [],
        dataset1: [],
        dataset2: [],
        dataset3: [],
        dataset4: [],
        dataset5: [],
        dataset6: [],
        dataset7: []
    }
};

var _optionModel = () => {
    return {
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        },
        series: [{
            axis: "y",
            dataset: "dataset0",
            key: "varStatus",
            color: "#ff5d99",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset1",
            key: "varStatus",
            color: "#a35dff",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset2",
            key: "varStatus",
            color: "#64ffff",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset3",
            key: "varStatus",
            color: "#e7f33d",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset4",
            key: "varStatus",
            color: "#f3893d",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset5",
            key: "varStatus",
            color: "#3d75f3",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset6",
            key: "varStatus",
            color: "#e83df3",
            type: ['line']
        }, {
            axis: "y",
            dataset: "dataset7",
            key: "varStatus",
            color: "#3df3b0",
            type: ['line']
        }],
        axes: { x: { key: "x", type: 'date' }, y: { min: -10, max: 50 } }
    }
}