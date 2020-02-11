'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  cityName : String,
  theaters:[]

},{
    usePushEach: true
});

module.exports = mongoose.model('cities', citySchema);