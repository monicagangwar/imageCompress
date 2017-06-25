'use strict';

const Fs = require('fs');
const Url = require('url');
const _ = require('lodash');
const Boom = require('boom');
const Request = require('request');
const Rp = require('request-promise');
const Constants = require('../helpers/constants');
const Compress = require('../businessLogic/compress');
const Promise = require('bluebird');

const getFileName = (uri) => {

    return Url.parse(uri).pathname
           .split('/')
           .pop()
           .replace('jpg', '')
           .replace('jpeg', '')
           .replace('png', '');
}

const validate = (uri) => {

    return Rp.head(uri)
    .then( (res) => {

        const fileName = getFileName(uri) + '_' + Date.now();
        switch(res['content-type']){

            case Constants.JPEG.CONTENT_TYPE: return ['JPEG', fileName, Compress.compressJpeg()];
            case Constants.JPG.CONTENT_TYPE: return ['JPG', fileName, Compress.compressJpeg()];
            case Constants.PNG.CONTENT_TYPE: return ['PNG', fileName, Compress.compressPng()];
            default: throw Boom.create(400, 'Content type is not an image');
        }
    });
};

const download = (uri) => {

    return validate(uri)
    .then( ([type, fileName, compressor]) => {

        return new Promise( (resolve) => {

            const srcFile = `${Constants[type].DOWNLOAD_PATH}/${fileName}.${Constants[type].EXTENSION}`;
            const writeStream = Fs.createWriteStream(srcFile);
            const downloadStream = Request(uri);
            downloadStream.pipe(writeStream);
            writeStream.on('close', () => {
                resolve([type, fileName, compressor]);
            });
            writeStream.on('error', (err) => {
                throw Boom.create(500, err.message);
            });
            downloadStream.on('error', (err) => {
                throw Boom.create(400, 'Error in downloading the image: ' + err.message);
            })
        })
    });
}

exports.downloadAndCompress = (uris) => {

    const steps = _.map(uris, (uri) => {
        return download(uri)
        .then( ([type, fileName, compressor]) => {

            return new Promise( (resolve) => {

                const srcFile = `${Constants[type].DOWNLOAD_PATH}/${fileName}.${Constants[type].EXTENSION}`
                const destFile = `${Constants[type].UPLOAD_PATH}/${fileName}.compressed.${Constants[type].EXTENSION}`
                const compressedWriteStream = Fs.createWriteStream(destFile);
                const readOriginalStream = Fs.createReadStream(srcFile);
                readOriginalStream.pipe(compressor).pipe(compressedWriteStream);

                compressedWriteStream.on('error', (err) => {
                    throw Boom.create(500, 'Error in compressing the image: ' + err.message);
                });
                compressor.on('error', (err) => {
                    throw Boom.create(500, 'Error in compressing the image: ' + err.message);
                });
                readOriginalStream.on('error', (err) => {
                    throw Boom.create(500, 'Error in reading the original file: ' + err.message);
                });
                compressedWriteStream.on('close', () => {

                    const imgDetails = {}
                    const sizeCompressed = Fs.statSync(destFile).size;  // converting from bytes to megabytes
                    const sizeOriginal = Fs.statSync(srcFile).size;
                    imgDetails['sizeOriginal'] = sizeOriginal;
                    imgDetails['sizeCompressed'] = sizeCompressed;
                    imgDetails['compressed'] = 100 * ( 1 - ( sizeCompressed / sizeOriginal));
                    imgDetails['filepath'] = destFile;
                    Fs.unlink(srcFile);
                    return resolve(imgDetails);
                });
            });
        });
    });
    return Promise.all(steps);
}
