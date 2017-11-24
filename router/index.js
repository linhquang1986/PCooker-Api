"use strict"
var express = require('express');
var router = express.Router();
let drink = require('./dinksOrder');
router.use('/drink', drink);
router.get('/management', (req, res) => {
    res.render('management');
})

module.exports = router;