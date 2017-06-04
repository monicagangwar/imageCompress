'use strict';

exports.register = (server, options, next) => {

    server.route(require('./compressFromUrl'));
    // server.route(require('./compressFromCsv'));
    // server.route(require('./compressFromPhoto'));
    next();
};

exports.register.attributes = {
    name: 'api'
};