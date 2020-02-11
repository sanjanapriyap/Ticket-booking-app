
'use strict';

const cityModel = require('../models/cityModel'),
    logger = require('../../logger');


//Add New city 
exports.addNewCity = function (req, res) {
    const newCityName = req.body.cityName;
    console.log(JSON.stringify(req.body), "city")
    cityModel.findOne({
        cityName: newCityName
    })
        .exec()
        .then(async (city) => {
            if (!city) {


                let newCity = new cityModel({
                    cityName: newCityName,
                    theaters: []
                })
                newCity.save(function (err, city) {
                    if (err) {
                        logger.error("Error in Adding City")
                        res.status(400).json({
                            success: false,
                            message: "Error in Adding City"
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: "City Added successfully"
                        });
                    }
                })
            } else {
                logger.info("City with given name already exists.")
                res.status(400).json({
                    success: false,
                    message: 'City with given name already exists.'
                });
            }
        })
}

exports.addNewTheater = function (req, res) {
    const cityName = req.params.cityName,
        theaterName = { "theaterName": req.body.theaterName };

    console.log(theaterName, "city" + cityName)
    try {
        cityModel.findOneAndUpdate({
            cityName: cityName
        }, { $addToSet: { "theaters": theaterName } })
            .exec()
            .then(async (city) => {
                if (city) {
                    res.status(200).json({
                        success: true,
                        message: "Theater Added successfully"
                    });
                } else {
                    logger.error("Theater Already Exists.")
                    res.status(400).json({
                        success: false,
                        message: "Theater Already Exists."
                    });
                }
            })
    } catch (e) {
        console.log(e, "exception")
    }

}
