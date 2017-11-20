"use strict"
var express = require('express');
var router = express.Router();

let wit = require('./wit');
let drink = require('./dinksOrder');

router.use('/wit', wit);
router.use('/drink', drink);

module.exports = router;