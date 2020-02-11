'use strict';

//External Modules 
const   mongoose = require('mongoose'),
        jwt = require('jsonwebtoken'),
        bcrypt = require('bcryptjs');

// Internal Modules
const   user = require('../../models/usersModel'),
        city = require('../../models/cityModel'),
        movie = require('../../models/movieModel'),
        config = require('../../../config.json');
        
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Sanju P",
    emailId: "SanjuP@gmail.com",
    password: bcrypt.hashSync("welcome@123", 10),
    token: jwt.sign({ _id: userOneId}, config.secret)
}
const movieId = new mongoose.Types.ObjectId()
const movieData = {
    _id: movieId,
    cityName : "Hyderabad",
    movieName:"Jaanu",
    theaters:[{
		"theaterName":"Shanti",
		"showTimings":[{
			"time":"2:00P.M",
			"seatCount": 40
		},
		{
			"time":"6:00P.M",
			"seatCount": 40
		},
		{
			"time":"9:00P.M",
			"seatCount": 40
        }]
    }]
}
const cityId = new mongoose.Types.ObjectId()
const cityData = {
    _id: cityId,
    cityName : "Hyderabad"
}

const userId = new mongoose.Types.ObjectId()

const setupDatabase = async () => {
    await user.deleteMany()
    await movie.deleteMany()
    await city.deleteMany()
    await new user(userOne).save()
    await new movie(movieData).save()
    await new city(cityData).save()
}

module.exports = {
    userOne,
    userOneId,
    movieId,
    movieData,
    cityId,
    cityData,
    setupDatabase
}