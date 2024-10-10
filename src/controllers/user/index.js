const routerBase = "/user";
const { resolve } = require("path");
const { User } = require(resolve('src', 'app', 'models'));

module.exports = (app, io)=>{
    app.get(`${routerBase}/:nickname`, async (req, res)=>{
        try {
            
            const { nickname } = req.params;

            const user = await User.findOne({
                where: {
                    nickname
                }
            });

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });

    app.get(`${routerBase}`, async ()=>{
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

            const hasUser = await User.findOne({
                where: {
                    nickname
                }
            });

            if(hasUser) return res.status(409).json({
                messageError: "Já existe um usuário com esse nickname!"
            });

            const user = await User.create({
                nickname
            });

            return res.status(201).json(user);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });
}