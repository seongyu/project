const express = require('express');
const dbcontrol = require('../database/controller')();
const util = require('util');
const queryset = require('../database/query');

const router = express.Router();

var handler = {
    getLists: async (req, res) => {},
    select: async (req, res) => {
        res.send({});
    },
    insert: async (req, res) => {
        res.send({});
    },
    update: async (req, res) => {
        res.send({});
    },
    delete: async (req, res) => {
        res.send({});
    },
    getPosition: async (req, res) => {
        var rs, _tag_id, _sql;
        try {
            _tag_id = req.params.tagId;
            _sql = util.format(queryset['map']['getTagPosition'], _tag_id);
            rs = await dbcontrol.query(_sql);
        } catch (e) {
            rs = false;
        } finally {
            res.send(rs);
        }
    },
    getZoneList: async (req, res) => {
        var rs, _data, items, _r, i, _sql,_k,j;
        try {
            _data = {
                table: 'zone'
            }
            rs = await dbcontrol.defaultQuery(_data, 'get');
            items = rs.data;
            if (items && items.length > 0) {
                for (i in items) {
                    _sql = util.format(queryset.map.getMapByZone,items[i].map_id);
                    _r = await dbcontrol.query(_sql);
                    if(!_r||!_r.data||_r.data.length<=0) continue;
                    _r = _r.data[0];
                    _k = Object.keys(_r);
                    for(j in _k){
                        items[i][_k[j]] = _r[_k[j]]
                    }
                }
            }
            rs = items;
            console.log(rs);
        } catch (e) {
            console.log(e);
            rs = false;
        } finally {
            res.send(rs);
        }
    }
}
router.get('/zone', handler.getZoneList)
router.get('/tag/position/:tagId', handler.getPosition)

// CRUD set
router.get('/:mapId', handler.select);
router.post('/:mapId', handler.update);
router.delete('/:mapId', handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);

module.exports = router;