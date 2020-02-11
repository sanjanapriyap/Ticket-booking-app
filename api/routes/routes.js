'use strict';

module.exports = function (app) {

    let usersController = require('../controllers/usersController'),
        cityController = require('../controllers/citiesController'),
        loginController = require('../controllers/authController'),
        movieController = require('../controllers/movieController'),
        authentication = require('../middleware/auth');

    //route to add new city
    app.route('/api/v1/addCity')
        .post(cityController.addNewCity);

    //route to add new Theater in a city
    app.route('/api/v1/addNewTheater/:cityName')
        .post(cityController.addNewTheater);

    //route to add new Movie in a city
    app.route('/api/v1/addNewMovie/:cityName')
        .post(movieController.addNewMovie);

    app.route('/api/v1/moviesList/:cityName')
        .get(movieController.moviesList);

    app.route('/api/v1/viewShowTimings/:cityName/:movieName')
        .get(movieController.viewShowTimings);

    app.route('/api/v1/viewAvailableSeats/:cityName/:movieName')
        .post(movieController.viewAvailableSeats);

    app.route('/api/v1/registerNewUser')
        .post(usersController.registerNewUser);

    app.route('/api/v1/auth')
        .post(loginController.loginAuth);

    app.route('/api/v1/bookTickets/:cityName/:movieName')
        .post(authentication.auth, movieController.bookTickets);
}