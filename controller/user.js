var db = require('../database/db');
var IFC = require('../controller/interface');
var sha1 = require('sha-1');
var itf = {};

itf._getParam = (param) => {
    var item = {};
    param.id ? item.id = param.id : null;
    param.password && param.password != '' ? item.password = param.password : null;
    param.companyName ? item.companyName = param.companyName : null;
    param.role ? item.role = param.role : null;
    param.flag ? item.flag = param.flag : null;
    param.last_access ? item.last_access = param.last_access : null;
    param.use_yn ? item.use_yn = param.use_yn : null;

    return item;
}

itf.create = (param, cb) => {
    var sql = 'select * from Users where id=? and use_yn=1;';
    var queryParam = [param.id]
    db.query(sql, queryParam)
        .then((rtn) => {
            if (rtn.length > 0) {
                cb({ status: false });
            } else {
                var _password = sha1(param.password);
                sql = 'insert into Users (id, password, companyName, role,flag) values (?,?,?,?,?);';
                queryParam = [
                    param.id,
                    _password,
                    param.companyName,
                    param.role,
                    param.flag
                ];
                db.query(sql, queryParam)
                    .then((rtn) => {
                        cb({ status: true });
                    }, (err) => {
                        cb({ status: false });
                    })
            }
        })
}

itf.update = (param, cb) => {
    var queryParam = itf._getParam(param);
    var sql = 'update Users set ? where id = ?';
    db.query(sql, [param, param.id])
        .then((rtn) => {
            cb({ status: true });
        }, (err) => {
            cb({ status: false });
        });
}

itf.find = (param, cb) => {
    var response = { status: false, data: [] };
    var sql = 'select * from Users';
    if (param) {
        sql = sql + ' where '
        var keys = Object.keys(param);

        keys.forEach((e) => {
            var qr = e + ' = "' + param[e] + '" and ';
            sql = sql + qr;
        });

        sql = sql.slice(0, -4);
    }
    db.query(sql)
        .then((rtn) => {
            response.status = true;
            response.data = rtn;
            cb(response)
        }, (err) => {
            cb(response)
        })
}

itf.login = (param, cb) => {

    var _password = sha1(param.password);
    var sql = 'select * from Users where id=? and password=? and use_yn=1;';
    var queryParam = [param.id, _password]
    db.query(sql, queryParam)
        .then((rtn) => {
            if (rtn.length > 0) {
                var user = rtn[0];
                user.last_access = new Date();
                itf.update(user, (res) => {
                    if (user.role.indexOf('admin') >= 0) {
                        IFC.get_all_flag(null, (data) => {
                            user.flag = data;
                            cb({ status: true, data: user });
                        })
                    } else {
                        user.flag = JSON.parse(user.flag)
                        cb({ status: true, data: user });
                    }

                })
            } else {
                cb({ status: false });
            }
        })
}
// itf.login({id:'steven',password:'administrator'},(e)=>{console.log(JSON.stringify(e))})
module.exports = itf;