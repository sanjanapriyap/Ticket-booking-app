'use strict'

// External Modules
const jwt = require('jsonwebtoken');

// Internal Modules
const userSchema = require('../models/usersModel'),
    config = require('../../config.json'),
    logger = require('../../logger');

const loggerName = "[authMiddleware ]: ";

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, config.secret)
        console.log(decoded)
        const user = await userSchema.findOne({ emailId: decoded.Email, 'token': token })
        console.log(user ,"user")
        if (!user) {
            throw new Error()
        }

        req.token = token
        next()
    } catch (err) {
        logger.error(loggerName + err)
        res.status(401).send({ error: "Please Authenticate First" })
    }
}