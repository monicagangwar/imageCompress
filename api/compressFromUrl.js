'use strict';

const Fs = require('fs');
const Boom = require('Boom');
const Joi = require('Joi');
const CompressFromUrl = require('../businessLogic/compressFromUrl');

module.exports = [
    {
        method: 'POST',
        path: '/api/compressFromUrl',
        handler: (req, reply) => {

            return CompressFromUrl.downloadAndCompress(req.payload)
            .then((compressedImgs) => {

                if(compressedImgs.length > 1){
                    reply(compressedImgs);
                }
                else {
                    console.log('here');
                    console.log(compressedImgs[0]);
                    reply.file(compressedImgs[0]);
                }
            })
            .catch( (err) => {

                if(err.isBoom){
                    reply(err);
                }
                else{
                    reply(Boom.create(500, err.message));
                }
            });
        },
    }
];