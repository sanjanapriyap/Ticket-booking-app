'use strict';

//External Modules 
const request = require('supertest'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

// Internal Modules
const server = require('../../server'),
    userModel = require('../../api/models/usersModel');

const { userOne, userOneId, setupDatabase } = require('../test/fixtures/booking')

beforeEach(setupDatabase)

// test for creating the new User
test('Should create a New User', async () => {
    const response = await request(server)
        .post('/api/v1/registerNewUser')
        .send({
            name: "Sanju P",
            emailId: "Sanju@gmail.com",
            password: bcrypt.hashSync("welcome@123", 10)
        })
        .expect(200)
})

//test for login 
test('Should login existing user', async () => {
    const response = await request(server)
        .post('/api/v1/auth')
        .send({
            emailId: userOne.emailId,
            password: "welcome@123"
        })
        .expect(200)

})

//test for Getting the list of all movies in City
test('Get list of all movies in City', async () => {
    const response = await request(server)
        .get('/api/v1/moviesList/Hyderabad')
        .send()
        .expect(200)

})
//test for Getting the show timings of movie in a theater
test('Get the show timings of movie in a theater', async () => {
    const response = await request(server)
        .get('/api/v1/viewShowTimings/Hyderabad/Jaanu')
        .send()
        .expect(200)
})

//test for et the available seats in the theater for a particular show
test('Get the available seats', async () => {
    const response = await request(server)
        .post('/api/v1/viewAvailableSeats/Hyderabad/Jaanu')
        .send({
            theaterName: "Shanti",
            time: "2:00P.M"
        })
        .expect(200)
})


