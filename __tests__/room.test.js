const { resolve } = require('path');
const request = require ('supertest');
const { app } = require (resolve('app'));
const { User, Room, UsersPerRoom, sequelize } = require(resolve("src", "app", "models"));
const { v4: uuidv4 } = require("uuid");

require('dotenv').config();

let userData = null;
let roomData = null;

async function initializeDatabase(){
    const obj = {
        nickname: "edurjnick"
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

test('GET /room', async () => {

    const url = `/${uuidv4()}`;

    let responseRoomGet = await request(app).get('/room')
        .query({
            url
        });

    expect(responseRoomGet.status).toBe(200); 
    expect(responseRoomGet.body).toEqual(null);

    roomData = await Room.create({
        url
    });

    responseRoomGet = await request(app).get('/room')
        .query({
            url
        });

    expect(responseRoomGet.body).toEqual(
        expect.objectContaining({
            url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    );

});

test('POST /room', async () => {

    const url = `/${uuidv4()}`;

    let responseRoomCreate = await request(app).post('/room')
        .send({
            url
        });

    expect(responseRoomCreate.status).toBe(201); 
    expect(responseRoomCreate.body).toEqual(
        expect.objectContaining({
            url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        })
    );

    await Room.destroy({
        where: {
            url: responseRoomCreate.body.url
        }
    });

});

test('PUT /favorite', async () => {

    const url = `/${uuidv4()}`;

    roomData = await Room.create({
        url
    });

    await UsersPerRoom.create({
        roomURL: url,
        nickname: userData.nickname,
        isFavorite: false
    });

    let responseRoomUpdate = await request(app).put('/room/favorite')
        .set("auth", userData.nickname)
        .send({
            url
        });

    expect(responseRoomUpdate.status).toBe(200); 
    expect(responseRoomUpdate.body).toEqual(
        expect.objectContaining({
            url,
            isFavorite: true
        })
    );

    const usersPerRoom = await UsersPerRoom.findOne({
        where: {
            roomURL: url,
            nickname: userData.nickname
        }
    });

    expect(usersPerRoom).toEqual(
        expect.objectContaining({
            roomURL: url,
            nickname: userData.nickname,
            isFavorite: true
        })
    );

});

test('PUT /unfavorite', async () => {

    const url = `/${uuidv4()}`;

    roomData = await Room.create({
        url
    });

    await UsersPerRoom.create({
        roomURL: url,
        nickname: userData.nickname,
        isFavorite: true
    });

    let responseRoomUpdate = await request(app).put('/room/unfavorite')
        .set("auth", userData.nickname)
        .send({
            url
        });

    expect(responseRoomUpdate.status).toBe(200); 
    expect(responseRoomUpdate.body).toEqual(
        expect.objectContaining({
            url,
            isFavorite: false
        })
    );

    const usersPerRoom = await UsersPerRoom.findOne({
        where: {
            roomURL: url,
            nickname: userData.nickname
        }
    });

    expect(usersPerRoom).toEqual(
        expect.objectContaining({
            roomURL: url,
            nickname: userData.nickname,
            isFavorite: false
        })
    );

});