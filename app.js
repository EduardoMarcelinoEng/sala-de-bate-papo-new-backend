const express = require('express');
const app = express();
const cors = require('cors');
const consign = require('consign');
const http = require('http');
const https = require('https');
const { resolve, join } = require('path');
const { disableCors, origin, forcarHTTPS, credentials } = require(resolve("src", "config"));

app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:false}));
if(disableCors) app.use(cors());

let httpServer = http.createServer(app);;
const httpsServer = forcarHTTPS ? https.createServer(credentials, app) : null;

const io = disableCors ? require("socket.io")(httpServer, {
    cors: {
      origin,
      methods: ["GET", "POST"]
    }
}) : require("socket.io")(httpsServer);

consign()
    .include(join("src", "controllers"))
    .into(app, io);

if(forcarHTTPS){
    app.use((req, res, next) => {
        if(!req.secure) return res.status(301).redirect(`https://${req.headers.host}${req.url}`);
        else next();
    });
}

module.exports = {
    httpServer,
    httpsServer,
    app
}