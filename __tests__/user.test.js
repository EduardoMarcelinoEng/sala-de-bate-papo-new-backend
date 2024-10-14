const { resolve } = require('path');
const request = require ('supertest');
const { app } = require (resolve('app'));
const { User, sequelize } = require(resolve("src", "app", "models"));
const { v4: uuidv4 } = require("uuid");

require('dotenv').config();

let userData = null;
let roomData = null;

async function initializeDatabase(){
    const obj = {
        nickname: "paulagomesnick"
    };

    userData = await User.create(obj);
}

async function clearDatabase() {
    if(userData) await userData.destroy();
    if(roomData) await roomData.destroy();
}

beforeEach(() => {
    return initializeDatabase();
});

afterEach(() => {
    return clearDatabase();
});

afterAll(done => {
    sequelize.close();
    done();
});

test('GET /user/:nickname', async () => {

    let responseUserGet = await request(app).get(`/user/${userData.nickname}`)
        .send();

    expect(responseUserGet.status).toBe(200); 
    expect(responseUserGet.body).toEqual(
        expect.objectContaining({
            nickname: userData.nickname,
            name: null,
            email: null,
            dateOfBirth: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    );

});

test('GET /user', async () => {

    let responseUserGet = await request(app).get(`/user`)
        .send();

    expect(responseUserGet.status).toBe(200);

    responseUserGet.body.forEach(data=>expect(data).toEqual(
        expect.objectContaining({
            nickname: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    ))

});

test('POST /user', async () => {

    const nickname = uuidv4();

    let responseUserCreate = await request(app).post('/user')
        .send({
            nickname: userData.nickname
        });

    expect(responseUserCreate.status).toBe(409);
    expect(responseUserCreate.body).toEqual(
        expect.objectContaining({
            messageError: expect.any(String)
        })
    );

    responseUserCreate = await request(app).post('/user')
        .send({
            nickname
        });

    expect(responseUserCreate.status).toBe(201);
    expect(responseUserCreate.body).toEqual(
        expect.objectContaining({
            nickname,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    );

    const user = await User.findOne({
        where: {
            nickname
        }
    });

    expect(user).toEqual(
        expect.objectContaining({
            nickname,
            name: null,
            email: null,
            dateOfBirth: null,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        })
    );

    await User.destroy({
        where: {
            nickname
        }
    });

});

test('PUT /user', async () => {

    let obj = {
        name: "Eduardo Marcelino",
        email: "eduardo@email.com",
        dateOfBirth: "2000-07-02"
    }

    let responseUserUpdate = await request(app).put(`/user/${userData.nickname}`)
        .send(obj);

    expect(responseUserUpdate.status).toBe(200); 
    expect(responseUserUpdate.body).toEqual(
        expect.objectContaining({
            nickname: userData.nickname,
            name: obj.name,
            email: obj.email,
            dateOfBirth: obj.dateOfBirth,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    );

    const user = await User.findOne({
        where: {
            nickname: userData.nickname
        }
    });

    expect(user).toEqual(
        expect.objectContaining({
            nickname: userData.nickname,
            name: obj.name,
            email: obj.email,
            dateOfBirth: obj.dateOfBirth,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        })
    );

});