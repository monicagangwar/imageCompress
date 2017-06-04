'use strict';

const Hapi = require('hapi');
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
        console.log('Server running at:', server.info.uri);
    });
});