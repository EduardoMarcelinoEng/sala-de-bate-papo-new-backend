const routerBase = "/room";
const { resolve } = require("path");
const { Room, UsersPerRoom } = require(resolve('src', 'app', 'models'));
const utils = require(resolve('src', 'utils'));

module.exports = (app, io)=>{
    app.get(`${routerBase}`, async (req, res)=>{
        try {
            
            const { url } = req.query;

            const room = await Room.findOne({
                where: {
                    url
                }
            });

            return res.status(200).json(room);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.post(`${routerBase}`, async (req, res)=>{
        try {
            
            const { url } = req.body;

            if(!utils.validateRoomURL(url)) return res.status(400).json("Informe uma url válida!");

            const urlFormated = url.length > 1 && url.charAt(url.length - 1) === "/" ?
                url.replace(/^(.+)\/$/, "$1") :
                url;

            const hasRoom = await Room.findOne({
                where: {
                    url: urlFormated
                }
            });

            if(hasRoom) return res.status(409).json({
                messageError: "Já existe uma sala com essa url!"
            });

            const room = await Room.create({
                url: urlFormated
            });

            return res.status(201).json(room);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.put(`${routerBase}/favorite`, async (req, res)=>{
        try {
            
            const { url } = req.body;
            const nickname = req.headers.auth;

            const usersPerRoom = await UsersPerRoom.findOne({
                where: {
                    roomURL: url,
                    nickname
                }
            });

            if(!usersPerRoom) return res.status(404).json("Você não está nessa sala!");

            if(usersPerRoom.isFavorite) return res.status(400).json(`A sala ${url} já está favoritada!`);

            usersPerRoom.isFavorite = true;

            await usersPerRoom.save();

            return res.status(200).json({
                url,
                isFavorite: usersPerRoom.isFavorite
            });

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.put(`${routerBase}/unfavorite`, async (req, res)=>{
        try {
            
            const { url } = req.body;
            const nickname = req.headers.auth;

            const usersPerRoom = await UsersPerRoom.findOne({
                where: {
                    roomURL: url,
                    nickname
                }
            });

            if(!usersPerRoom) return res.status(404).json("Você não está nessa sala!");

            if(!usersPerRoom.isFavorite) return res.status(400).json(`A sala ${url} não é favorita!`);

            usersPerRoom.isFavorite = false;

            await usersPerRoom.save();

            return res.status(200).json({
                url,
                isFavorite: usersPerRoom.isFavorite
            });

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });
}