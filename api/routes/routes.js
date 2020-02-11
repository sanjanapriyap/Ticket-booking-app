'use strict';

module.exports = function (app) {

    let usersController = require('../controllers/usersController'),
        cityController = require('../controllers/citiesController'),
        loginController = require('../controllers/authController'),
        movieController = require('../controllers/movieController'),
        authentication = require('../middleware/auth');

    //api to add new city
    app.route('/api/v1/addCity')
        .post(cityController.addNewCity);

    //api to add new Theater in a city
    app.route('/api/v1/addNewTheater/:cityName')
        .post(cityController.addNewTheater);

    //api to add new Movie in a city
    app.route('/api/v1/addNewMovie/:cityName')
        .post(movieController.addNewMovie);

    //api call for getting the movies list
    app.route('/api/v1/moviesList/:cityName')
        .get(movieController.moviesList);

    //api call for viewing show timings
    app.route('/api/v1/viewShowTimings/:cityName/:movieName')
        .get(movieController.viewShowTimings);

    //api call for viewing available seats
    app.route('/api/v1/viewAvailableSeats/:cityName/:movieName')
        .post(movieController.viewAvailableSeats);

    //api call for Registering a new user
    app.route('/api/v1/registerNewUser')
        .post(usersController.registerNewUser);

    //api call for Login
    app.route('/api/v1/auth')
        .post(loginController.loginAuth);

    //secured api call for booking the tickets.
    app.route('/api/v1/bookTickets/:cityName/:movieName')
        .post(authentication.auth, movieController.bookTickets);
}