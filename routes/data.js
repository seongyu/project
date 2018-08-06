var express = require('express');
var router = express.Router();

// var db = require('../database/db');
var itf = require('../controller/interface');

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
    
    itf.crawler(param, () => {
        res.send(true);    
    })
});

module.exports = router;
