'use strict';

const Fs = require('fs');
const Hapi = require('hapi');
const Constants = require('./helpers/constants');
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});

server.register([
    require('./api/index')
], (err) => {

    if (err) {
        throw err;
    }

    server.start((err) => {
        if(!Fs.existsSync(Constants.CSV.DOWNLOAD_PATH)){
            Fs.mkdirSync(Constants.CSV.DOWNLOAD_PATH);
        }
        if(!Fs.existsSync(Constants.JPG.DOWNLOAD_PATH)){
            Fs.mkdirSync(Constants.JPG.DOWNLOAD_PATH);
        }
        if(!Fs.existsSync(Constants.JPEG.DOWNLOAD_PATH)){
            Fs.mkdirSync(Constants.JPEG.DOWNLOAD_PATH);
        }
        if(!Fs.existsSync(Constants.PNG.DOWNLOAD_PATH)){
            Fs.mkdirSync(Constants.PNG.DOWNLOAD_PATH);
        }
        console.log('Server running at:', server.info.uri);
    });
});