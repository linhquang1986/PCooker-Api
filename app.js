"use strict"
var express = require('express');
var path = require('path');
var appConfig = require('./config');
var app = express();
// node js automatically open browser
var opn = require('opn');


let port = appConfig.server.port;

//app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', require('./router'));

app.set('port', port)

let listener = app.listen(port, () => {
    console.log('Server running on localhost:' + listener.address().port);
    //opn('http://localhost:5000');
});


module.exports = app;// for testing


