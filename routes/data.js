var express = require('express');
var router = express.Router();

var db = require('../database/db');


// db.query('select * from tblDevice order by id desc limit 10')
// .then(function(res){
//   console.log(res);
// });

/* set Data */
router.get('/', function(req, res, next) {
  res.send({'test':'1234'});
});

/* set Data */
router.post('/', function(req, res, next) {
    var param = req.body;
    

    var sql = 'insert into deviceDB.DeviceLog SET ?';
    param = JSON.parse(event.body);

    db.query(sql,param)
    .then((res) => {
        res.send(true);
    })
});

module.exports = router;
