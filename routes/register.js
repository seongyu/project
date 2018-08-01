var express = require('express');
var router = express.Router();

var db = require('../database/db');
var itf = require('../controller/interface')
/* Registration Device */
router.post('/', function(req, res, next) {
  res.send(true);
  return null;
  var param = req.body;


  data.register(param,(rtn) => {
    res.send(rtn);
  })

  var sql = 'select * from DeviceInfo where deviceID = ? and placeName = ?';
  db.query(sql,{deviceID:param.deviceID,placeName:param.placeName})
  .then(function(res){
    if(res.length > 0){
      res.send(true);
    }else{
      sql = 'insert into DeviceInfo (deviceID, deviceName, placeName, companyName) set (?,?,?,?)';
      var value = {
        deviceID : param.deviceID,
        deviceName : param.deviceName,
        placeName : param.placeName,
        companyName : param.companyName
      }
      db.query(sql,value).then(function(err){
        console.log(err);
        res.send(true);
      })
    }
  });
});

module.exports = router;