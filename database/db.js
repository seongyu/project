var mysql = require('mysql');
var promise = require('q');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'device.cpejzij0uvoq.ap-northeast-2.rds.amazonaws.com',
    user: 'steven',
    password: 'stevenfighting!',
    database: 'deviceDB'
});

exports.query = function(sql, param) {
    var defer = promise.defer();
    pool.getConnection(function(err, conn) {
        conn.query(sql, param, function(err, rows) {
            if (err) {
                defer.reject(err)
            } else {
                rows = JSON.parse(JSON.stringify(rows));
                defer.resolve(rows);
            }
            conn.release();
        });
    });

    return defer.promise;
};


exports.querySet = {
    monitor_device_modules: function(deviceName, siteName, companyName) {
        var tpl = ['select * from  ',
            '(SELECT b.*, a.varStatus, a.eventTime FROM DeviceLog as a ',
            'left join DeviceInfo as b on a.moduleSeq = b.moduleSeq ',
            'where b.deviceName = "', deviceName,
            '" and b.siteName = "', siteName,
            '" and b.companyName = "', companyName,
            '" order by eventTime desc) as c ',
            'group by c.moduleSeq;'
        ].join("");
        return tpl;
    },
    monitor_status_modules: function(devices) {
        var tpl = ['select moduleSeq, varStatus from (select * from DeviceLog where moduleSeq in ('];
        devices.forEach((e) => {
            tpl.push(e + ', ')
        });
        tpl[tpl.length - 1] = tpl[tpl.length - 1].slice(0, -2);
        tpl.push(' order by eventTime desc) as a group by moduleSeq;');

        return tpl.join("");
    },
    history_create: function(param) {
        var sql = 'select * from DeviceLog as a left join DeviceInfo as b on a.moduleSeq = b.moduleSeq';
        var keys = Object.keys(param);
        if (keys.length > 0) {
            sql = sql + ' where '
        }
        var set_where = false;
        var queryParam = [];
        keys.forEach((e) => {
            if (e == 'startDate') {
                sql = sql + ' eventTime >= ? '
            } else if (e == 'endDate') {
                sql = sql + ' eventTime < ? '
            } else {
                sql = sql + ' ' + e + ' = ? '
            };
            queryParam.push(param[e]);
            sql = sql + ' and ';
            set_where = true;
        });

        sql = set_where ? sql.slice(0, -4) : sql;
        sql = sql + ' order by eventTime desc;';

        return { sql: sql, param: queryParam };
    }
}