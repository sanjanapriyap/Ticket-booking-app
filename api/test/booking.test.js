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
            // _id: new mongoose.Types.ObjectId(),
            name: "Sanju P",
            emailId: "Sanju@gmail.com",
            password: bcrypt.hashSync("welcome@123", 10)
        })
        .expect(200)
})
//test for Book tickets
// test('Should Book tickets', async () => {
//     const response = await request(server)
//         .post('/api/v1/bookTickets/Hyderabad/Jaanu')
//         .set('Authorization', `Bearer ${userOne.token}`)
//         .send({
//             theaterName: "Shanti",
//             noOfTickets: 2,
//             time: "2:00P.M"
//         })
//         .expect(200)
// })

//test for login Process
test('Should login existing user', async () => {
    const response = await request(server)
        .post('/api/v1/auth')
        .send({
            emailId: userOne.emailId,
            password: "welcome@123"
        })
        .expect(200)

})

//test for listing all movies
test('Should list all movies', async () => {
    const response = await request(server)
        .get('/api/v1/moviesList/Hyderabad')
        .send()
        .expect(200)

})
//test for viewShowTimings/:cityName/:movieName
test('Should list show times', async () => {
    const response = await request(server)
        .get('/api/v1/viewShowTimings/Hyderabad/Jaanu')
        .send()
        .expect(200)
})

//test for viewAvailableSeats
test('Should viewAvailableSeats', async () => {
    const response = await request(server)
        .post('/api/v1/viewAvailableSeats/Hyderabad/Jaanu')
        .send({
            theaterName: "Shanti",
            time: "2:00P.M"
        })
        .expect(200)
})



// // test for authentication failed
// test('Should not login nonexistent user', async () => {
//     await request(server)
//         .post('/api/v1/login')
//         .send({
//             email: userOne.email,
//             password: 'IncorrectPassword'
//         })
//         .expect(400)
// })
