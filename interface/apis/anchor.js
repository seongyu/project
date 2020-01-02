const express = require('express');
const dbcontrol = require('../database/controller');
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
    }
}

// CRUD set
router.get('/:anchorId',handler.select);
router.post('/:anchorId',handler.update);
router.delete('/:anchorId',handler.delete);
router.post('/', handler.insert);

router.get('/', handler.getLists);




module.exports = router;