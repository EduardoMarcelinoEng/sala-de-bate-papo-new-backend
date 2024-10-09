const { resolve } = require("path");
const { httpPort, httpsPort, forcarHTTPS } = require(resolve("src", "config"));
const { httpServer, httpsServer } = require(resolve("app"));

httpServer.listen(httpPort, ()=>console.log(`Application HTTP running at ${httpPort}`));

if(forcarHTTPS){
    httpsServer.listen(httpsPort, ()=>console.log(`Application HTTPS running at ${httpsPort}`));
}