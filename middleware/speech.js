"use strict"
var appConfig = require('../config');
const speechApiKey = appConfig.google_api.speech.key_url;
const project_id = appConfig.google_api.speech.project_id;
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

module.exports = class {
    constructor() {
        this.request = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 44100,
                languageCode: 'vi-VN'
            },
            interimResults: false, // set to true to receive in-progress guesses
            singleUtterance: false // set to true to close stream after a finished utterance
        };
        this.recognizeStream = new speech.SpeechClient({
            projectId: project_id,
            keyFilename: speechApiKey
        })
    }
    startGoogleSpeechStream(ws) {
        let that = this;
        return that.recognizeStream.streamingRecognize(that.request)
            .on('error', (err) => {
                console.log(`ERROR: On Streaming recognize stream: ${err}`);
                return ws.terminate();
            })
            .on('data', (data) => {
                if (data.results.length > 0) {
                    var text = data.results[0].alternatives[0].transcript;
                    ws.send(`[Heard]: ${text}`); // send transcript to client  \
                }
            });
    }
}