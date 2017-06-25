'use strict';

const Fs = require('fs');
const Boom = require('boom');
const Csv = require('csv-parser');
const Promise = require('bluebird');
const Constants = require('../helpers/constants');
const CompressFromUrl = require('./compressFromUrl');

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
                if(extension === 'csv'){
                    return resolve(['CSV', fileName, null]);
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

    return validate(payload.file.hapi.headers)
    .then( ([type, fileName, compressor]) => {

        return new Promise( (resolve) => {

            const srcFile = `${Constants[type].DOWNLOAD_PATH}/${fileName}.${Constants[type].EXTENSION}`;
            const writeStream = Fs.createWriteStream(srcFile);
            payload.file.pipe(writeStream);
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

        return new Promise( (resolve, reject) => {

            const srcFile = `${Constants[type].DOWNLOAD_PATH}/${fileName}.${Constants[type].EXTENSION}`;
            const readStream = Fs.createReadStream(srcFile).pipe(Csv());
            const imgUrls = [];
            readStream.on('data', (data) => {
                imgUrls.push(data.url);
            })
            readStream.on('error', (error) => {
                reject(Boom.create('Error in reading and parsing csv: ' + error.message));
            })
            readStream.on('end', () => {
                Fs.unlink(srcFile);
                resolve(CompressFromUrl.downloadAndCompress(imgUrls));
            });
        });
    });
}
