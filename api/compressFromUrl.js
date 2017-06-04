'use strict';

const Boom = require('Boom');
const Joi = require('Joi');
const CompressFromUrl = require('../businessLogic/compressFromUrl');

module.exports = [
    {
        method: 'POST',
        path: '/api/compressFromUrl',
        handler: (req, reply) => {

            reply(CompressFromUrl.downloadAndCompress(req.payload));
        },
    }
];