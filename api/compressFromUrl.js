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
            .then(([writeStream, filePath, fileName, type]) => {

                return writeStream.on('close', () => {

                    reply(Fs.createReadStream(filePath))
                    .header('Content-type', type)
                    .header('Content-disposition', `attachment;filename=${fileName}`);
                })
            });
        },
    }
];