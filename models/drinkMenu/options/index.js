var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var con = require('../connection');

var optionsSchma = new Schema({
    value: { type: String, default: '', required: true, unique: true },
    question: { type: String, default: '', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null }
}, { versionKey: false });
var Options = con.model('Options', optionsSchma);
module.exports = Options;