var db = require('../database/db');

var data = {};

data.register = (param,cb) => {
      var sql = 'select * from tblDeviceInfo where deviceID = ? and placeName = ?';
      db.query(sql,{deviceID:param.deviceID,placeName:param.placeName})
      .then(function(res){
        if(res.length > 0){
          cb({status:true})
        }else{
          sql = 'insert into tblDeviceInfo (deviceID, deviceName, placeName, companyName) set (?,?,?,?)';
          var value = {
            deviceID : param.deviceID,
            deviceName : param.deviceName,
            placeName : param.placeName,
            companyName : param.companyName
          }
          db.query(sql,value).then(function(err){
            if(err){
                res.send({status:false,message:err});
            }else{
                res.send({status:true})
            }
          })
        }
      });
}


module.exports = data;