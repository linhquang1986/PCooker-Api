"use strict"
var express = require('express');
var router = express.Router();
let drink = require('./dinksOrder');
let witai = require('./witAi');

router.use('/drink', drink);

router.use('/wit', witai);

router.get('/management', (req, res) => {
    res.render('management');
})
router.get('/witai', (req, res) => {
    res.render('witai');
})

module.exports = router;