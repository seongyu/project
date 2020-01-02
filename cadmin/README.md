# cadmin
# create by Leonkim

## Project setup
$ npm install

### Compiles and hot-reloads for development
$ npm run serve

### Compiles and minifies for production
$ npm run build

### Lints and fixes files
$ npm run lint






## for api test
pwd : ~/inverse-tool/collector/src/cassandra-client

const configs = require('../../configs').cassandraClient;
const cassandra = require('cassandra-driver');
const client = new cassandra.Client(configs.clientOptions);

client.execute('show keyspaces',console.log)