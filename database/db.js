var mysql = require('mysql');
var promise = require('q');

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'device.cpejzij0uvoq.ap-northeast-2.rds.amazonaws.com',
    user     : 'steven',
    password : 'stevenfighting!',
    database : 'deviceDB'
});

exports.query = function(sql,param){
    var defer = promise.defer();
    pool.getConnection(function(err, conn) {
        conn.query(sql, param,function(err,rows){
            if(err){
                defer.reject(err)
            }else{
                rows = JSON.parse(JSON.stringify(rows));
                defer.resolve(rows);
            }
            conn.release();
        });
    });

    return defer.promise;
};