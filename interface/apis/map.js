const express = require('express');
const dbcontrol = require('../database/controller')();
const util = require('util');
const queryset = require('../database/query');

const router = express.Router();

var handler = {
    getLists : async (req,res) => {
    },
    select : async (req,res) => {
        res.send({});
    },
    insert : async (req,res) => {
        res.send({});
    },
    update : async (req,res) => {
        res.send({});
    },
    delete : async (req,res) => {
        res.send({});
    },
    getPosition : async (req,res)=>{
        var rs, _tag_id, _sql;
        try{
            _tag_id = req.params.tagId;
            _sql = util.format(queryset['map']['getTagPosition'],_tag_id);
            rs = await dbcontrol.query(_sql);
        }catch(e){
            rs = false;
        }finally{
            res.send(rs);
        }
    },
    getZoneList : async (req,res) => {
        var rs, _data;
        try{
            _data = {
                table : 'zone'
            }
            rs = await dbcontrol.defaultQuery(_data,'get');
            console.log(rs);
        }catch(e){
            rs = false;
        }finally{
            res.send(rs);
        }
    }
}
router.get('/zone',handler.getZoneList)
router.get('/tag/position/:tagId',handler.getPosition)

// CRUD set
router.get('/:mapId',handler.select);
router.post('/:mapId',handler.update);
router.delete('/:mapId',handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);

module.exports = router;