'use strict';

const movieModel = require('../models/movieModel'),
    cityModel = require('../models/cityModel'),
    userModel = require('../models/usersModel'),
    logger = require('../../logger');

exports.addNewMovie = function (req, res) {
    const cityName = req.params.cityName,
        theaters = req.body.theaters,
        movieName = req.body.movieName;

    try {
        cityModel.findOne({
            cityName: cityName
        })
            .exec()
            .then(async (city) => {
                if (city) {
                    movieModel.findOne({
                        cityName: cityName, movieName: movieName
                    })
                        .exec()
                        .then(async (movie) => {
                            if (!movie) {
                                let newMovie = new movieModel({
                                    cityName: cityName,
                                    movieName: movieName,
                                    theaters: theaters
                                })
                                newMovie.save(function (err, movie) {
                                    if (err) {
                                        logger.error("Error in Adding Movie")
                                        res.status(400).json({
                                            success: false,
                                            message: "Error in Adding Movie"
                                        });
                                    } else {
                                        res.status(200).json({
                                            success: true,
                                            message: "Movie Added successfully"
                                        });
                                    }
                                })
                            } else {
                                logger.error("Already Exists.")
                                res.status(400).json({
                                    success: false,
                                    message: "Movie already Exists."
                                });
                            }
                        })
                } else {
                    logger.error("We don't serve this city right now.")
                    res.status(400).json({
                        success: false,
                        message: "We don't serve this city right now.."
                    });
                }
            })

    } catch (e) {
        console.log(e, "exception")
    }

}

exports.moviesList = function (req, res) {
    const cityName = req.params.cityName
    cityModel.findOne({
        cityName: cityName
    })
        .exec()
        .then(async (city) => {
            if (city) {
                movieModel.find({
                    cityName: cityName
                }, { movieName: 1 })
                    .exec()
                    .then(async (movies) => {
                        console.log(movies)
                        if (movies.length != 0) {
                            res.status(200).json({
                                success: true,
                                message: movies
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                message: "No movies available in this city"
                            });
                        }
                    })
            } else {
                logger.error("We don't serve this city right now.")
                res.status(400).json({
                    success: false,
                    message: "We don't serve this city right now.."
                });
            }
        })
}


exports.viewShowTimings = function (req, res) {
    const cityName = req.params.cityName,
        movieName = req.params.movieName;
    cityModel.findOne({
        cityName: cityName
    })
        .exec()
        .then(async (city) => {
            if (city) {
                movieModel.findOne({
                    $and: [{ cityName: cityName, movieName: movieName }]
                }, { "theaters.theaterName": 1, "theaters.showTimings.time": 1 })
                    .exec()
                    .then(async (theaters) => {
                        if (theaters) {
                            res.status(200).json({
                                success: true,
                                message: theaters
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                message: "Movie is not available in this city"
                            });
                        }
                    })
            } else {
                logger.error("We don't serve this city right now.")
                res.status(400).json({
                    success: false,
                    message: "We don't serve this city right now.."
                });
            }
        })
}

exports.viewAvailableSeats = function (req, res) {
    const cityName = req.params.cityName,
        movieName = req.params.movieName,
        theaterName = req.body.theaterName,
        time = req.body.time;
    cityModel.findOne({
        cityName: cityName
    })
        .exec()
        .then(async (city) => {
            if (city) {
                movieModel.findOne({
                    $and: [
                        {
                            cityName: cityName, movieName: movieName, "theaters.theaterName": theaterName
                        }]
                },
                    { theaters: { $elemMatch: { theaterName: theaterName } } })
                    .exec()
                    .then(async (seats) => {

                        if (seats) {
                            var theaterFound = seats.theaters;
                            for (var theaterNo = 0; theaterNo < theaterFound.length; theaterNo++) {
                                var shows = theaterFound[theaterNo].showTimings;
                                for (var showNo = 0; showNo < shows.length; showNo++) {
                                    var showTime = shows[showNo].time;
                                    if (showTime === time) {
                                        var seatsAvailable = { "seatsAvailable": shows[showNo].seatCount };
                                        res.status(200).json({
                                            success: true,
                                            message: seatsAvailable
                                        });
                                    }
                                }
                            }

                        } else {
                            res.status(400).json({
                                success: false,
                                message: "Error in fetching seats"
                            });
                        }
                    })
            } else {
                logger.error("We don't serve this city right now.")
                res.status(400).json({
                    success: false,
                    message: "We don't serve this city right now.."
                });
            }
        })
}

exports.bookTickets = async function (req, res) {
    var cityName = req.params.cityName,
        movieName = req.params.movieName,
        emailId = req.body.emailId,
        noOfTickets = req.body.noOfTickets,
        time = req.body.time,
        theaterName = req.body.theaterName;
    var seats = await viewSeats(cityName, movieName, theaterName, time)
    var seatsAvailable = seats.seatsAvailable;
    if (seatsAvailable >= noOfTickets) {
        var balanceTickets = seatsAvailable - noOfTickets;
        movieModel.findOneAndUpdate({
            $and: [
                {
                    cityName: cityName, movieName: movieName
                }]
        },
            {
                $set: { "theaters.$[elem1].showTimings.$[elem2].seatCount": balanceTickets }
            },
            {
                arrayFilters: [{ "elem1.theaterName": theaterName }, { "elem2.time": time }]
            }
        )
            .exec()
            .then(async (userLoggedIn) => {
                if (userLoggedIn) {
                    res.status(200).json({
                        success: true,
                        result: "Successfully Booked Tickets. No.of Tickets " + noOfTickets

                    });
                }

            })
    }


}


function viewSeats(cityName, movieName, theaterName, time) {
    return new Promise((resolve, reject) => {


        movieModel.findOne({
            $and: [
                {
                    cityName: cityName, movieName: movieName, "theaters.theaterName": theaterName
                }]
        },
            { theaters: { $elemMatch: { theaterName: theaterName } } })
            .exec()
            .then(async (seats) => {
                if (seats) {
                    var theaterFound = seats.theaters;
                    for (var theaterNo = 0; theaterNo < theaterFound.length; theaterNo++) {
                        var shows = theaterFound[theaterNo].showTimings;
                        for (var showNo = 0; showNo < shows.length; showNo++) {
                            var showTime = shows[showNo].time;
                            if (showTime === time) {
                                var seatsAvailable = { "seatsAvailable": shows[showNo].seatCount };
                                resolve(seatsAvailable)
                            }
                        }
                    }

                } else {
                    resolve(null);
                }
            })
    })
}