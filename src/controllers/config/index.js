const routerBase = "/config";
const { resolve } = require("path");
const { urlsUnavailable } = require(resolve("src", "config"));

module.exports = (app, io)=>{
    app.get(`${routerBase}`, async (req, res)=>{
        try {
            
            return res.status(200).json({
                urlsUnavailable
            });

        } catch (error) {
            return res.status(500).json(error.message);
        }
    });
}