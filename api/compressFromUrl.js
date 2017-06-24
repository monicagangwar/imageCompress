'use strict';

const Boom = require('Boom');
const Joi = require('Joi');
const CompressFromUrl = require('../businessLogic/compressFromUrl');

module.exports = [
    {
        method: 'POST',
        path: '/api/compressFromUrl',
        handler: (req, reply) => {

            CompressFromUrl.downloadAndCompress(req.payload)
            .then((compressedImgs) => {

                reply(compressedImgs);
            })
            .catch( (e) => {

                (e.isBoom) ? reply(e) : reply(Boom.create(500, e.message));
            });
        },
    }
];