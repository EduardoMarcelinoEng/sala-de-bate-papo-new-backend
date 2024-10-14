const routerBase = "/user";
const { resolve } = require("path");
const { User, UsersPerRoom, Room } = require(resolve('src', 'app', 'models'));
const moment = require("moment");

module.exports = (app, io)=>{
    app.get(`${routerBase}/:nickname`, async (req, res)=>{
        try {
            
            const { nickname } = req.params;

            const user = await User.findOne({
                where: {
                    nickname
                },
                include: [
                    {
                        model: UsersPerRoom,
                        include: [
                            {
                                model: Room
                            }
                        ]
                    }
                ]
            });

            if(!user) return res.status(200).json(null);

            user.dataValues.rooms = user.UsersPerRooms.map(({ Room, isFavorite }) => ({ url: Room.url, isFavorite }));
            delete user.dataValues.UsersPerRooms;

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.get(`${routerBase}`, async (req, res)=>{
        try {
            const users = await User.findAll();

            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.post(`${routerBase}`, async (req, res)=>{
        try {
            
            const { nickname } = req.body;

            const hasUser = await User.findByPk(nickname);

            if(hasUser) return res.status(409).json({
                messageError: "Já existe um usuário com esse nickname!"
            });

            const user = await User.create({
                nickname
            });

            user.dataValues.rooms = [];

            return res.status(201).json(user);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.put(`${routerBase}/:nickname`, async (req, res)=>{
        try {
            
            const { nickname } = req.params;
            const { email, name, dateOfBirth } = req.body;

            if(dateOfBirth && !moment(dateOfBirth, "YYYY-MM-DD").isValid()) return res.status(400).json("Informe uma data de nascimento válida!");
            if(email && (typeof email !== "string" || !/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i.test(email))) return res.status(400).json("Informe um e-mail válido!");
            if(name && (typeof name !== "string" || /\d/.test(name))) return res.status(400).json("Nome inválido! Informe o seu nome.");

            const user = await User.findByPk(nickname);

            if(!user) return res.status(404).json(`O usuário com nickname ${nickname} não existe!`);

            if(name) user.name = name;
            if(email) user.email = email.toLowerCase();
            if(dateOfBirth) user.dateOfBirth = dateOfBirth;

            const result = await user.save();

            return res.status(200).json(result);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });
}