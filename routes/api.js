var express = require('express');
var router = express.Router();

// var db = require('../database/db');
var itf = require('../controller/interface');
var user = require('../controller/user');

var util = require('../util');

// db.query('select * from tblDevice order by id desc limit 10')
// .then(function(res){
//   console.log(res);
// });

router.post('/login', (req, res) => {
    var param = req.body;
    user.login(param, (result) => {
        res.send(result);
    })
});

router.post('/user', (req, res) => {
    var param = req.body;
    user.create(param, (result) => {
        res.send(result);
    })
})

router.post('/user/update', (req, res) => {
    var param = req.body;
    user.update(param, (result) => {
        res.send(result);
    })
})

router.get('/users/:companyName', (req, res) => {
    var param = {};
    req.params.companyName != 'all' ? param.companyName = req.params.companyName : null;

    user.find(param, (result) => {
        res.send(result);
    });
})

router.get('/addr', (req, res) => {
    itf.get_addr_table((result) => {
        res.send(result)
    })
})

router.post('/monitor/device', (req, res) => {
    var param = req.body
    itf.monitor_device(param, (result) => {
        res.send(result);
    })
})

router.post('/history', (req, res) => {
    var param = req.body
    itf.history(param, (result) => {
        res.send(result);
    })
})

router.post('/history/excel', (req, res) => {
    var param = req.body
    itf.excelDownload(param, (result) => {
        if (result.status) {
            console.log(util.path + '/' + result.data)
            res.download(util.path + '/' + result.data)
        } else {
            res.send(result);
        }
    })
})

/* set Data */
router.get('/', (req, res) => {
    res.send({ 'test': '1234' });
});

/* set Data */
router.post('/', function(req, res, next) {
    var param = req.body;

    itf.crawler(param, () => {
        res.send(true);
    })
});

module.exports = router;