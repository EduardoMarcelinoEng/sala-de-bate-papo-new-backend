const { resolve } = require("path");
const { Room, UsersPerRoom, Message, User } = require(resolve('src', 'app', 'models'));
const auth = require(resolve('src', 'middlewares', 'webSocketAuth'));

module.exports = function(app, io) {
    
    const userNamespace = io.of("/");
    userNamespace.use(auth);

    userNamespace.on("connection", (socket) => {
        const user = socket.handshake.auth.user;
        socket.data.userId = user.id;
        socket.data.registerFinished = socket.handshake.auth.registerFinished;

        socket.on('room:in', async (roomURL, data)=>{

            const room = await Room.findOne({
                include: [
                    {
                        model: Message,
                        include: [
                            {
                                model: User
                            }
                        ]
                    }
                ],
                where: {
                    url: roomURL
                }
            });

            if(!room) return ({
                isError: true,
                message: `A sala com url ${roomURL} não existe!`
            });

            socket.rooms.forEach(value=>{
                socket.leave(value);
            });

            const alreadyEnteredTheRoom = await UsersPerRoom.findOne({
                where: {
                    nickname: user.nickname,
                    roomURL
                }
            });

            if(!alreadyEnteredTheRoom){
                UsersPerRoom.create({
                    nickname: user.nickname, roomURL
                });
            }

            socket.join(room.url);

            if(data) return data(room);

        });

        socket.on('chat:send', async ({ text, url }, data)=>{

            const isInTheRoom = await UsersPerRoom.findOne({
                where: {
                    roomURL: url,
                    nickname: user.nickname
                }
            });

            if(!isInTheRoom && data) return data({
                isError: true,
                message: `Você não está na sala ${url}`
            });

            const message = await Message.create({
                roomURL: url,
                nickname: user.nickname,
                text
            });

            socket.broadcast.to(url).emit('message:new', {
                user,
                roomURL: url,
                message: {
                    text,
                    datetime: message.createdAt
                }
            });

            if(data) data(message);
        });
    });

    userNamespace.adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
        const socket = io.sockets.sockets.get(id);

        socket.to(room).emit("room:user:entered", {
            user: socket.handshake.auth.user,
            url: room,
            socketId: socket.id
        });
    });

    userNamespace.adapter.on("leave-room", (room, id) => {
        console.log(`socket ${id} has leave room ${room}`);
        const socket = io.sockets.sockets.get(id);

        socket.to(room).emit("room:user:leave", {
            user: socket.handshake.auth.user,
            url: room,
            socketId: socket.id
        });
    });

};