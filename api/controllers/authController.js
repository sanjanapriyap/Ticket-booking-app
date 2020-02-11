'use strict';

const userModel = require('../models/usersModel'),
    config = require('../../config.json'),
    logger = require('../../logger'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

exports.loginAuth = function (req, res) {
    var emailId = req.body.emailId,
        password = req.body.password;
    if (!emailId || !password) {
        return res.status(400).json({
            success: false,
            result: {
                "message": "Authentication Parameters Missing"
            }
        });

    }
    try {
        userModel.findOne({ emailId: emailId }, {})
            .exec()
            .then(async (user) => {
                if (!user) {
                    res.status(400).json({
                        success: false,
                        message: "Given Email Id doesn't exist. Please register"
                    })

                } else if (user && bcrypt.compareSync(password, user.password)) {

                    let authData = {
                        _id: user._id,
                        Email: user.emailId,
                    };

                    let token = jwt.sign(authData, config.secret, {
                        expiresIn: config.jwt_expiretime
                    });
                    userModel.updateOne({ emailId: emailId }, { $set: { token: token } })
                        .exec()
                        .then(async (userLoggedIn) => {
                            logger.debug("Successfully authorized");
                            req.token = token;
                            res.status(200).json({
                                success: true,
                                result: {
                                    token: token,
                                    _id: user._id,
                                    emailId: user.emailId
                                }
                            });
                        })
                } else {
                    logger.debug("Authentication failed. Incorrect password.");
                    return res.status(400).json({
                        success: false,
                        message: 'Authentication failed. Please check emailId or password'
                    });
                }
            })
    } catch (e) {
        console.log(err);
        logger.error("Error While Login --" + (err));
        res.status(400).json({
            success: false,
            message: "Error While Login"
        });
    }

}