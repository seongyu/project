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
    var res_itf = { status: false, deviceSeq: null };
    var sql = 'select * from DeviceInfo where deviceName = ? and varAddr = ? and varLabel = ? and companyName = ? and siteName = ?';
    var queryParam = [param.deviceName, param.varAddr, param.varLabel, param.companyName, param.siteName]
    db.query(sql, queryParam)
        .then((res) => {
            if (res.length > 0) {
                res_itf.status = true;
                res_itf.deviceSeq = res[0].deviceSeq;
                cb(res_itf)
            } else {
                sql = 'insert into DeviceInfo (varAddr, varLabel, companyName, siteName) values (?,?,?,?,?);';

                db.query(sql, queryParam).then((res) => {
                    res_itf.status = true;
                    res_itf.deviceSeq = res.insertId
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
    var sql = 'insert into DeviceLog (deviceSeq, varStatus) values (?,?);';
    var queryParam = [param.deviceSeq,param.varStatus];
    db.query(sql,queryParam)
    .then((res) => {
        cb({status:true})
    },(err) => {
        cb({status:false})
    })
};

itf.crawler = (tdts,cb) => {
    var flist = [];
    promise.forEach(tdts,(e)=>{
        var defer = promise.defer();

        _register(e,(res) => {
            e.deviceSeq = res.deviceSeq;
            _writeLog(e, (res1) => {
                defer.resolve({status:true})
            });
        });


        return defer.promise
    }).then((res) => {
        cb(res)
    });
}

itf.get_modules_device = (param,cb) => {
    var response = { status: false, data: [] };
    var sql = 'select * from DeviceInfo where deviceName = ? and siteName = ? and companyName = ?;';
    var queryParam = [param.deviceName,param.siteName,param.companyName];
    db.query(sql, queryParam)
    .then((res) => {
        response.status = true;
        response.data = res;
    },(err) => {
        cb(response);
    })
};


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