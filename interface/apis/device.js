const express = require('express');
const util = require('util');
const dbcontrol = require('../database/controller')();
const queryset = require('../database/query');
const router = express.Router();
var param, _data, rs, query, _device_type, _rs, i, _it;

var handler = {
    getLists : async (req,res) => {
        try{
            _device_type = req.query.type;
            if(_device_type){
                _data = {
                    table : 'device_infos',
                    where : {
                        device_type : _device_type
                    }
                }
            }else{
                _data = {
                    table : 'device_infos'
                }
            }
            
            rs = await dbcontrol.defaultQuery(_data,'get');

            if(rs.data.length>0&&_device_type=='Beacon'){
                _rs = await dbcontrol.query(queryset.anchor.getRawData);
                _rs = JSON.parse(_rs.data[0].data);
                for(i in rs.data){
                    _it = rs.data[i];
                    _r = _rs.find(_ => {
                    return _.mac == _it.device_id;
                    });
                    if (_r) {
                        rs.data[i]["battery_level"] = _r["battLevel"];
                    }
                }
            }

        }catch(e){
            console.log(e);
            rs = false;
        }finally{
            res.send(rs);
        }
    },
    select : async (req,res) => {
        try{
            _data = {
                table : 'device_infos',
                where : {
                    device_id : req.params.deviceId
                }
            }
            rs = await dbcontrol.defaultQuery(_data,'get');

            if(rs.data.length>0&&rs.data[0].device_type=='Beacon'){
                _rs = await dbcontrol.query(queryset.anchor.getRawData);
                _rs = JSON.parse(_rs.data[0].data);
                for(i in rs.data){
                    _it = rs.data[i];
                    _r = _rs.find(_ => {
                    return _.mac == _it.device_id;
                    });
                    console.log(_r);
                    if (_r) {
                        rs.data[i]["rssi"]= _r.rssi;
                        rs.data[i]["version"] = _r.majorVer + ':' + _r.minorVer,
                        rs.data[i]["uuid"] = _r.UUID;
                        rs.data[i]["battery_level"] = _r["battLevel"] + '%';
                    }
                }
            }

        }catch(e){
            console.log(e)
            rs = false;
        }
        
        res.send(rs);
    },
    monitor : async (req,res) => {
        try{
            param = req.body.deviceId;
            if(!param){
                throw false;
            }

            query = util.format(queryset['device']['monitor'],param);
            rs = await dbcontrol.query(query);
        }catch(e){
            rs = false;
        }finally{
            res.send(rs);
        }
    },
    insert : async (req,res) => {
        try{
            param = req.body;
            _data = {
                table : 'device_infos',
                set : param
            }
            rs = await dbcontrol.defaultQuery(_data,'ins');
        }catch(e){
            rs = false;
        }finally{
            res.send(rs);
        }
    },
    update : async (req,res) => {
        try{
            param = req.body;
            _data = {
                table : 'device_infos',
                set : param,
                where : {
                    device_id : req.params.deviceId
                }
            }
            rs = await dbcontrol.defaultQuery(_data,'udt');
        }catch(e){
            rs = false;
        }finally{
            res.send(rs);
        }
    },
    delete : async (req,res) => {
        try{
            param = req.body;
            _data = {
                table : 'device_infos',
                where : {
                    device_id : req.params.deviceId
                }
            }
            rs = await dbcontrol.defaultQuery(_data,'del');
        }catch(e){
            rs = false;
        }finally{
            res.send(rs);
        }
    }
}


router.get('/:deviceId/monitor',handler.monitor);

// CRUD set
router.get('/:deviceId',handler.select);
router.post('/:deviceId',handler.update);
router.delete('/:deviceId',handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);

module.exports = router;