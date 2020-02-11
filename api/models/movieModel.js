'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  cityName : String,
  movieName:String,
  theaters:[]

},{
    usePushEach: true
});

module.exports = mongoose.model('movies', movieSchema);