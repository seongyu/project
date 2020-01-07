const express = require('express');
const dbcontrol = require('../database/controller')();
const util = require('util');
const queryset = require('../database/query');

const router = express.Router();

var handler = {
    getLists: async (req, res) => {
        var rs = null;
        try {
            _data = {
                table: 'maps'
            }

            rs = await dbcontrol.defaultQuery(_data, 'get');
        } catch (e) {
            rs = false;
        } finally {
            res.send(rs);
        }
    },
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
        var rs, _data, items, _r, i, _sql, _k, j;
        try {
            _data = {
                table: 'zone'
            }
            rs = await dbcontrol.defaultQuery(_data, 'get');
            items = rs.data;
            if (items && items.length > 0) {
                for (i in items) {
                    _sql = util.format(queryset.map.getMapByZone, items[i].map_id);
                    _r = await dbcontrol.query(_sql);
                    if (!_r || !_r.data || _r.data.length <= 0) continue;
                    _r = _r.data[0];
                    _k = Object.keys(_r);
                    for (j in _k) {
                        items[i][_k[j]] = _r[_k[j]]
                    }
                }
            }
            rs = items;
        } catch (e) {
            console.log(e);
            rs = false;
        } finally {
            res.send(rs);
        }
    },
    insetZone: async (req, res) => {
        var rs, _param = req.body, _data;
        try {
            _data = {
                table: 'zone',
                set: {
                    map_id: _param.map_id,
                    zone_id: _param.zone_id
                }
            }
            rs = await dbcontrol.defaultQuery(_data, 'ins');
        } catch (e) {
            rs = false;
        } finally {
            res.send(rs);
        }
    },
    deleteZone: async (req, res) => {
        var rs, _param = req.params, _data;
        try {
            _data = {
                table: 'zone',
                where: {
                    map_id: _param.map_id,
                    zone_id: _param.zone_id
                }
            }
            rs = await dbcontrol.defaultQuery(_data, 'del');
        } catch (e) {
            rs = false;
        } finally {
            res.send(rs);
        }
    }
}
// const fs = require('fs');
// async function writeTT(){
//     var rs;
//     rs = await dbcontrol.query('select image_url from maps limit 1;');

//     await fs.writeFileSync('testfile', rs.data[0]['image_url']);
//     console.log('done')
// }
//writeTT()

router.get('/zone', handler.getZoneList)
router.post('/zone', handler.insetZone)
router.delete('/zone/:map_id/:zone_id', handler.deleteZone)
router.get('/tag/position/:tagId', handler.getPosition)

// CRUD set
router.get('/:mapId', handler.select);
router.post('/:mapId', handler.update);
router.delete('/:mapId', handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);

module.exports = router;