"use strict"
var WebSocketServer = require("ws").Server;
var Speech = require('./speech');

module.exports = class {
    constructor(server) {
        this.server = server;
        this.wss = new WebSocketServer({ server: this.server });
        this.speech = new Speech();
    }
    connectionSpeechClient() {
        let that = this;
        that.wss.on('connection', function (ws) {
            console.log('Client connected: ' + ws._ultron.id);
            var gstreams; // keeep track of speech streams
            //var activeStreamID = -1; // pointer to active speech stream
            ws.on('message', function (data) {
                if (typeof data == 'string') {
                    if (data.indexOf("info") > 0) { // client sends an info string on connection that triggers server to start a speech stream             
                        console.log('Start first stream');
                        gstreams = that.speech.startGoogleSpeechStream(ws);
                        //activeStreamID = activeStreamID + 1;
                    }
                    else { // client requested a new speech stream (client-side logic allows for triggering on a lull in input volume)
                        console.log('Start another stream');
                        gstreams.end();
                        gstreams = that.speech.startGoogleSpeechStream(ws);
                        //activeStreamID = activeStreamID + 1;
                    }
                }
                else {
                    gstreams.write(data); // client sent audio, push it to active speech stream 
                }
            });
            ws.on('close', function () {
                console.log('Client disconnected');
                ws.isAlive = false;
                gstreams.end();
            });
            ws.on('error', function (err) {
                console.log(`Web socket error ${err.message}`);
            });
        });
    }
}