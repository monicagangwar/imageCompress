'use strict';

const Boom = require('Boom');
const Joi = require('Joi');
const CompressFromCsv = require('../businessLogic/compressFromCsv');

module.exports = [
    {
        method: 'POST',
        path: '/api/compressFromCsv',
        handler: (req, reply) => {

            CompressFromCsv.downloadAndCompress(req.payload)
            .then((compressedImgs) => {

                reply(compressedImgs);
            })
            .catch( (e) => {

                (e.isBoom) ? reply(e) : reply(Boom.create(500, e.message));
            });
        },
        config: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 125829120 //20 * 6MB files
            },
        }
    }
];