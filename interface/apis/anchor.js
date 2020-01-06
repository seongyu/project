const express = require('express');
const dbcontrol = require('../database/controller')();
const queryset = require('../database/query');

const router = express.Router();

var handler = {
    getRawData : async (req,res) => {
        var rs = null;
        try{
            rs = await dbcontrol.query(queryset.anchor.getRawData);
            rs = JSON.parse(rs.data[0].data);
        }catch(e){
            console.log(e)
            rs = false;
        }finally{
            res.send(rs);
        }
    },
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
    }
}

// CRUD set
router.get('/raws',handler.getRawData);

router.get('/:anchorId',handler.select);
router.post('/:anchorId',handler.update);
router.delete('/:anchorId',handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);




module.exports = router;