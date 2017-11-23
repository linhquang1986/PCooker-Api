"use strict"
var express = require('express');
var router = express.Router();
let drink = require('./dinksOrder');
router.use('/drink', drink);

module.exports = router;