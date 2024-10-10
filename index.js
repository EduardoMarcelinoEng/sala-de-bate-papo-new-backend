const { resolve } = require("path");
const { httpPort, httpsPort, forcarHTTPS } = require(resolve("src", "config"));
const { httpServer, httpsServer } = require(resolve("app"));
const { sequelize } = require(resolve("src", "app", "models"));

(async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Database connection successfully established!');
      } catch (error) {
        console.error('The database connection was not established:', error);
        return;
    }

    httpServer.listen(httpPort, ()=>console.log(`Application HTTP running at ${httpPort}`));

    if(forcarHTTPS){
        httpsServer.listen(httpsPort, ()=>console.log(`Application HTTPS running at ${httpsPort}`));
    }
})();