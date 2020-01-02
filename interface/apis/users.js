const express = require('express');
const moment = require('moment');
const crypto = require('crypto');
const dbcontrol = require('../database/controller');
const queryset = require('../database/query');

const router = express.Router();
var param, _data, rs;

var handler = {
    getLists : async (req,res) => {
        
    },
    login : async (req,res) => {
        param = req.body, rs = null;

        try{
            _data = {
                table : 'users',
                where : {
                    email : param['email'],
                    password : crypto.createHash('sha512').update(param['password']).digest('base64')
                }
            }
            rs = await dbcontrol.defaultQuery(_data,'get')
            if(rs.rows.length>0){
                _data = {
                    table : 'users',
                    set : {
                        login_dt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    },
                    where : {
                        email : param['email']
                    }
                }
                await dbcontrol.defaultQuery(_data,'udt')
            }
        }catch(e){
            rs = false
        }finally{
            res.send(rs);
        }
    },
    select : async (req,res) => {
        res.send(true);
    },
    insert : async (req,res) => {
        param = req.body, rs = null;

        try{
            _data = {
                table : 'users',
                set : {
                    email : param['email'],
                    password : crypto.createHash('sha512').update(param['password']).digest('base64'),
                    register_dt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    login_dt : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
            }
            rs = await dbcontrol.defaultQuery(_data,'ins')
        }catch(e){
            rs = false
        }finally{
            res.send(rs);
        }
    },
    update : async (req,res) => {
        res.send({});
    },
    delete : async (req,res) => {
        res.send({});
    }
}


router.post('/login', handler.login);

// CRUD set
router.get('/:email',handler.select);
router.post('/:email',handler.update);
router.delete('/:email',handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);

module.exports = router;