var db = require('../database/db');
var promise = require('q');
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

// parameter에 따른 모듈 정보 획득
// input Object {companyName,siteName,deviceName}
itf.get_modules_device = (param,cb) => {
    var response = { status: false, data: [] };
    var sql = 'select * from DeviceInfo';
    var queryParam = [];
    var obj = Object.keys(param);
    if(obj.length>0){
        sql = sql + ' where '
        obj.forEach((e) => {
            var t = e + ' = ? and ';
            sql = sql + t;
            queryParam.push(param[e]);
        });

        sql = sql.slice(0,-4);
    }
    // deviceName = ? and siteName = ? and companyName = ?;
    db.query(sql, queryParam)
    .then((res) => {
        response.status = true;
        var data = [];
        res.forEach((e) => {
            data[e.companyName] ? null : data[e.companyName] = {};
            data[e.companyName][e.siteName] ? null : data[e.companyName][e.siteName] = {};
            data[e.companyName][e.siteName][e.deviceName] ? null : data[e.companyName][e.siteName][e.deviceName] = [];
            data[e.companyName][e.siteName][e.deviceName].push({
                moduleSeq : e.moduleSeq,
                varAddr : e.varAddr,
                varLabel : e.varLabel
            })
        })
        response.data = data;
        cb(response);
    },(err) => {
        cb(response);
    })
};

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
itf.get_all_flag = (cb) => {
    var response = { status: false, data: [] };
    var sql = 'select companyName from DeviceInfo group by companyName';
    db.query(sql)
    .then((result1) => {

        var sql = 'select deviceName, companyName from DeviceInfo group by deviceName, companyName';
        db.query(sql)
        .then((result2) => {
            var data = {};
            result1.forEach((e) => {
                var obj = {};
                var jrr = result2.filter((j) => {return j.companyName == e.companyName});
                data[e.companyName] = jrr;
            });
            response.status = true;
            response.data = data;
            cb(response);
        })
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

module.exports = itf;