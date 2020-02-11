'use strict';

const userModel = require('../models/usersModel'),
    bcrypt = require('bcryptjs'),
    logger = require('../../logger');

exports.registerNewUser = function (req, res) {
    var name = req.body.name,
        emailId = req.body.emailId,
        password = req.body.password;
    try {
        userModel.findOne({ emailId: emailId }, {})
            .exec()
            .then(async (user) => {
                if (!user) {
                    let newUser = new userModel({
                        name: name,
                        emailId: emailId,
                        password: bcrypt.hashSync(password, 10),
                    })
                    newUser.save(function (err, user) {
                        if (err) {
                            logger.error("Error in Adding New User")
                            res.status(400).json({
                                success: false,
                                message: "Error in Adding New User"
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Registered successfully"
                            });
                        }
                    })

                } else {
                    res.status(400).json({
                        success: false,
                        message: "Email Id has already been registered."
                    })
                }
            })
    } catch (e) {
        console.log(e)
    }


}