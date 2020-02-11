
"use strict";

// global variables
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    config = require('./config.json'),
    mongoose = require('mongoose'),
    logger = require('./logger');


const port = process.env.PORT || config.port ,
dbconnection = process.env.DB || config.db;

const loggerName = "[Server]: ";
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

app.on('uncaughtException', function (err) {
    logger.error(loggerName, "UNCAUGHT EXCEPTION: " + err);
});

app.on('error', function (err) {
    logger.error(loggerName, "ERROR: " + err);
});

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(dbconnection, { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
   logger.info('[Server]:Connection with MongoDB installed');
});


// Enable Cross Origin Resource Sharing
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Origin,Content-type,Accept,X-Access-Token,X-Key,Cache-Control,X-Requested-With,Access-Control-Allow-Origin,Access-Control-Allow-Credentials');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
//app.all('*', auth);
let routes = require('./api/routes/routes');
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.status(404).send({ err: 'Not found' });
});

app.listen(port);

logger.info('[Server]:server started on: ' + port);

module.exports = app;