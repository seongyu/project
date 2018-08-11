var express = require('express');
var router = express.Router();

// var db = require('../database/db');
var itf = require('../controller/interface');
var user = require('../controller/user');

// db.query('select * from tblDevice order by id desc limit 10')
// .then(function(res){
//   console.log(res);
// });

router.post('/login', (req, res) => {
  var param = req.body;
  user.login(param,(result)=>{
    res.send(result);
  })
})

router.get('/addr', (req, res) => {
  itf.get_addr_table((result)=>{
    res.send(result)
  })
})

router.post('/monitor/device',(req,res) => {
  var param = req.body
  itf.monitor_device(param,(result) => {
    res.send(result);
  })
})

/* set Data */
router.get('/', (req, res) => {
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
