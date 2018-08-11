var express = require('express');
var router = express.Router();

var itf = require('../controller/interface');

/* set Data */
router.post('/', function(req, res, next) {
    var param = req.body;
    
    itf.crawler(param, () => {
        res.send(true);    
    })
});
module.exports = router;