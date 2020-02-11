'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    emailId: String,
    password: String,
    token:String

}, {
    usePushEach: true
});

module.exports = mongoose.model('users', userSchema);