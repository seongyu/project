const cassandra = require('cassandra-driver');
const config = require('./config');

let mode = config['MODE'];

var client, keyspace;

var cassandraControl = async () => {
    console.log(mode);
    client = await new cassandra.Client(config[mode]['cassandraConfig']);
    console.log(client)
    keyspace = config[mode]['cassandraConfig']['keyspace'];
}


var sql = 'select * from device_infos';


var run = async () => {
    var result = {};
    await cassandraControl();
    var err, rs = await client.execute(sql);
    if (err) {
        result.data = err;
    } else {
        result.status = true;
        result.data = rs['rows'];
    }

    console.log(result);
}

run();