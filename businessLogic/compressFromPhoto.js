'use strict';

const Fs = require('fs');
const _ = require('lodash');
const Boom = require('boom');
const Constants = require('../helpers/constants');
const Compress = require('../businessLogic/compress');
const Promise = require('bluebird');

const getFileName = (header) => {

    let filename = header.split(';')
                     .pop()
                     .split('=')
                     .pop()
                     .replace(/"/g, '')
                     .split('.');
    const extension = filename.pop();
    filename = filename.join('.');
    return [filename, extension];
}

const validate = (headers) => {

    const fileDetails = getFileName(headers['content-disposition']);
    const fileName = fileDetails[0] + '_' + Date.now();
    const extension = fileDetails[1];
    return new Promise( (resolve, reject) => {

        switch(headers['content-type']){

            case Constants.JPEG.CONTENT_TYPE: return resolve(['JPEG', fileName, Compress.compressJpeg()]);
            case Constants.JPG.CONTENT_TYPE: return resolve(['JPG', fileName, Compress.compressJpeg()]);
            case Constants.PNG.CONTENT_TYPE: return resolve(['PNG', fileName, Compress.compressPng()]);
            case Constants.EXECUTABLE.CONTENT_TYPE: {
                if(extension === 'png'){
                    return resolve(['PNG', fileName, Compress.compressPng()]);
                }
                else{
                    return reject(Boom.create(400, 'Content type is not an image'));
                }
            }
            default: return reject(Boom.create(400, 'Content type is not an image'));
        }
    });
};

const download = (payload) => {

    return validate(payload.image.hapi.headers)
    .then( ([type, fileName, compressor]) => {

        return new Promise( (resolve) => {

            const srcFile = `${Constants[type].DOWNLOAD_PATH}/${fileName}.${Constants[type].EXTENSION}`;
            const writeStream = Fs.createWriteStream(srcFile);
            payload.image.pipe(writeStream);
            writeStream.on('close', () => {
                resolve([type, fileName, compressor]);
            });
            writeStream.on('error', (err) => {
                throw Boom.create(500, err.message);
            });
        });
    });
}

exports.downloadAndCompress = (payload) => {

    return download(payload)
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
}
