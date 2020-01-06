const cassandra = require('cassandra-driver');
const config = require('../config');
const queryset = require('./query');
const util = require('util');

let mode = config['MODE'];

var controller = {
    client : null,
    queryset : queryset,
    keyspace : null,
    defaultForm : {
        get : 'select * from %s where %s',
        ins : 'insert into %s (%s) values (%s)',
        udt : 'update %s set %s where %s',
        del : 'delete from %s where %s'
    }
}

controller.query = async (sql) => {
    var result = {
        status : false,
        data : null
    };
    var err,rs = await controller.client.execute(sql);
    if(err){
        result.data = err;
    }else{
        result.status = true;
        result.data = rs['rows'];
    }

    return result;
};

/*
data = {
    table : '',
    set : {},
    where : {}
}
ex => 
data = {
    table : 'device_infos',
    set : {
        device_type : 'a',
        map_id : 'c',
        status : 1,
        is_enabled : 1,
        device_id : 'test'
    },
    where : {
        device_id : 'test'
    }
}
*/
controller.defaultQuery = async function(data,type){
    var result = {
        status : false,
        data : null
    };
    var sql = '';
    var table = controller.keyspace+'.'+data.table;
    var keys, wheres, sql, where_value = '', key_value = '';

    try{
        keys = data.set? Object.keys(data.set): [];
    }catch(e){
        keys = [];
    }
    try{
        wheres = data.where? Object.keys(data.where): [];
    }catch(e){
        wheres = [];
    }
    
    if(type=='ins'){
        sql = controller.defaultForm.ins;
        key_value = keys.join(", ");
        for(var i in keys){
            if(keys[i]!='status'){
                where_value = where_value + "'" + data.set[keys[i]] + "', ";
            }else{
                where_value = where_value + data.set[keys[i]]+', ';
            }
        }

        // for device insert, add registered_time
        key_value = key_value + ", registered_time";
        where_value = where_value + "now()";

        sql = util.format(sql,table,key_value,where_value);
    }else if(type=='udt'){
        sql = controller.defaultForm.udt;
        for(var i in keys){
            if(keys[i]=='status'){
                key_value += keys[i]+'='+'\''+data.set[keys[i]]+'\', '
            }else{
                key_value += keys[i]+'='+data.set[keys[i]]+', '
            }
        };

        // for device update, add modified_time
        key_value = key_value + " modified_time=now()";

        for(var i in wheres){
            where_value += wheres[i]+'='+'\''+data.where[wheres[i]]+'\' AND '
        };
        where_value = where_value.slice(0,-5);

        sql = util.format(sql,table,key_value,where_value);

    }else if(type=='get'){
        sql = controller.defaultForm.get;

        if(wheres.length>0){
            for(var i in wheres){
                where_value += wheres[i]+'='+'\''+data.where[wheres[i]]+'\' AND '
            };
            where_value = where_value.slice(0,-5);
        }else{
            sql = sql.slice(0,-9)
        }

        sql = util.format(sql,table,where_value);
        sql = [sql,' ALLOW FILTERING'].join("");
    }else if(type=='del'){
        sql = controller.defaultForm.del;

        for(var i in wheres){
            where_value += wheres[i]+'='+'\''+data.where[wheres[i]]+'\' AND '
        };
        where_value = where_value.slice(0,-5);

        sql = util.format(sql,table,where_value);
    }

    try{
        console.log(sql);
        var err,rs = await controller.client.execute(sql);
        console.log('success : ',rs['rows']);
    }catch(e){
        console.log(e)
    }
    
    if(err){
        result.data = err;
    }else{
        result.status = true;
        result.data = rs['rows'];
    }

    return result;
}

var cassandraControl = ()=>{
    controller.client = new cassandra.Client(config[mode]['cassandraConfig']);
    controller.keyspace = config[mode]['cassandraConfig']['keyspace'];
    return controller
}

module.exports = cassandraControl