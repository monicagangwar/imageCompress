'use strict';

exports.register = (server, options, next) => {

    server.register([require('vision'), require('inert')], (err) => {
        if (err) console.log(err);
    });
    server.route(require('./compressFromUrl'));
    // server.route(require('./compressFromCsv'));
    // server.route(require('./compressFromPhoto'));
    next();
};

exports.register.attributes = {
    name: 'api'
};