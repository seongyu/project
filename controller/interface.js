var db = require('../database/db');
var promise = require('q');
var util = require('../util');
require('q-foreach')(promise);


var testData = {
    varAddr: 'vas',
    varLabel: 'test',
    companyName: 'zdfzsdf',
    siteName: 'vawg'
};

var itf = {};

var _register = (param,cb) => {
    var res_itf = { status: false, moduleSeq: null };
    var sql = 'select * from DeviceInfo where deviceName = ? and varAddr = ? and varLabel = ? and companyName = ? and siteName = ?';
    var queryParam = [param.deviceName, param.varAddr, param.varLabel, param.companyName, param.siteName]
    db.query(sql, queryParam)
        .then((res) => {
            if (res.length > 0) {
                res_itf.status = true;
                res_itf.moduleSeq = res[0].moduleSeq;
                cb(res_itf)
            } else {
                sql = 'insert into DeviceInfo (varAddr, varLabel, companyName, siteName) values (?,?,?,?,?);';

                db.query(sql, queryParam).then((res) => {
                    res_itf.status = true;
                    res_itf.moduleSeq = res.insertId
                    cb(res_itf)
                }, (err) => {
                    cb(res_itf)
                })
            }
        }, (err) => {
            cb(res_itf)
        });
};

var _writeLog = (param,cb) => {
    var sql = 'insert into DeviceLog (moduleSeq, varStatus) values (?,?);';
    var queryParam = [param.moduleSeq,param.varStatus];
    db.query(sql,queryParam)
    .then((res) => {
        cb({status:true})
    },(err) => {
        cb({status:false})
    })
};

// for Device to get Data
// input Object {}
itf.crawler = (tdts,cb) => {
    var flist = [];
    promise.forEach(tdts,(e)=>{
        var defer = promise.defer();

        _register(e,(res) => {
            e.moduleSeq = res.moduleSeq;
            _writeLog(e, (res1) => {
                defer.resolve({status:true})
            });
        });


        return defer.promise
    }).then((res) => {
        cb(res)
    });
}

// 각 모듈의 마지막 데이터 for monitoring
// input Array (moduleSeq)
itf.get_status_modules = (param,cb) => {
    var response = { status: false, data: [] };
    var sql = db.querySet.monitor_status_modules(param);
    
    db.query(sql)
    .then((res) => {
        response.status = true;
        response.data = res;
        cb(response);
    },(err) => {
        cb(response);
    })
};

// 모든 회사/장비 그룹핑된 모듈 명
itf.get_all_flag = (param, cb) => {
    var response = { status: false, data: [] };
    var data = {};
    var sql = 'select * from DeviceInfo';
    sql = param && param.companyName ? sql + ' where companyName = ?' : sql;
    db.query(sql,param && param.companyName ? param.companyName : null)
    .then((result1) => {

        //deeper 1. company
        var grouping = util.groupBy(result1,(item)=>{return item.companyName});
        var groupingKey = Object.keys(grouping);

        groupingKey.forEach((e)=>{
            //deefer 2. site
            var it1 = {};
            var groupingA = util.groupBy(grouping[e],(item)=>{return item.siteName});
            groupingAKey = Object.keys(groupingA);
            //defer 3. device
            groupingAKey.forEach((j)=> {
                it1[j] = util.groupBy(groupingA[j],(item)=>{return item.deviceName});
            });
            data[e] = it1
        })

        cb(data);
    })
}

itf.monitor_device = (param,cb) => {
    var response = { status: false, data: [] };
    var deviceName = param.deviceName;
    var siteName = param.siteName;
    var companyName = param.companyName;

    // get modules status in device;
    var sql = db.querySet.monitor_device_modules(deviceName, siteName, companyName);
    db.query(sql)
    .then((res) => {
        response.status = true;
        response.data = res;
        cb(response);
    },(err) => {
        cb(response);
    })
}

itf.get_addr_table = (cb) => {
    var response = { status: false, data: [] };
    var sql = 'select * from tblAddrTitleMapping order by varAddr;';
    db.query(sql)
    .then((res)=>{
        var grouping = util.groupBy(res,(item)=>{return item.varType});
        response.status = true;
        response.data = grouping;
        cb(response)
    },(err) => {
        cb(response);
    })
}

var test = (param,cb) => {
    var sql = 'update DeviceInfo set ? where varLabel = ?';
    db.query(sql,[param,param.varLabel])
    .then((rtn)=>{
        cb({status:true});
    },(err)=>{
        console.log(err)
        cb({status:false});
    })
}

// test(testData,(res)=>{
//     console.log(res)
// })
// itf.get_all_flag((r) => {console.log(JSON.stringify(r))})
// 
// 
// 

// var item = util.groupBy([
//     {type:"Dog", age: 3, name:"Spot"},
//     {type:"Cat", age: 3, name:"Tiger"},
//     {type:"Dog", age: 4, name:"Rover"}, 
//     {type:"Cat", age: 3, name:"Leo"}
// ], function(item){
//     return item.type
// })

// console.log(item)

module.exports = itf;