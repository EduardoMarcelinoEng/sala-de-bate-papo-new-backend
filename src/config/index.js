require('dotenv').config();
const { readFileSync } = require("fs");

const config = {
    httpPort: process.env.HTTP_PORT,
    httpsPort: process.env.HTTPS_PORT,
    urlsUnavailable: [
        "/login", "/meu-perfil", "/room", "/user", "/config"
    ],
    disableCors: false,
    origin: "",
    pathCredentialsKey: process.env.PATH_CREDENTIALS_KEY,
    pathCredentialsCert: process.env.PATH_CREDENTIALS_CERT,
    pathCredentialsCA: process.env.PATH_CREDENTIALS_CA,
    credentials: {
        key: "",
        cert: "",
        ca: ""
    },
    database: {
        username: process.env.USERNAME_DATABASE,
        password: process.env.PASSWORD_DATABASE,
        database: process.env.NAME_DATABASE,
        host: process.env.HOST_DATABASE,
        dialect: "mysql",
        timezone: "-03:00"
    }
};

switch(process.env.ENV){
    case 'development':
        config.origin = "http://localhost:3000";
        config.forcarHTTPS = false;
        config.disableCors = true;

    break;
    case 'production':
        config.origin = "";
        config.forcarHTTPS = true;
        config.disableCors = false;

        config.credentials.key = readFileSync(config.pathCredentialsKey, 'utf8');
        config.credentials.cert = readFileSync(config.pathCredentialsCert, 'utf8');
        config.credentials.ca = readFileSync(config.pathCredentialsCA, 'utf8');
    break;
}

module.exports = config;