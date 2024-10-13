const { resolve } = require('path');
const { User } = require(resolve('src', 'app', 'models'));

module.exports = async (socket, next) => {
    
    let err  = new Error('Authentication error');
    
    const nickname = socket.handshake.auth.nickname;

    if(!nickname){
        err.data = { response : 'Nickname não foi informado!' };
        return next(err);
    }

    const user = await User.findByPk(nickname);

    if(!user){
        err.data = { response : 'Nickname não foi encontrado!' };
        return next(err);
    }

    socket.handshake.auth.user = user;
    socket.handshake.auth.registerFinished = user.name && user.email && user.dateOfBirth;

    next();

}