'use strict';

const Fs = require('fs');
const Url = require('url');
const _ = require('lodash');
const Boom = require('boom');
const Request = require('request');
const Rp = require('request-promise');
const Constants = require('../helpers/constants');
const Compress = require('../businessLogic/compress');

const getFileName = (uri) => {

    return Url.parse(uri).pathname
           .split('/')
           .pop()
           .replace('jpg', '')
           .replace('jpeg', '')
           .replace('png', '')
           .replace('gif', '')
}

const validate = (uri) => {

    return Rp.head(uri)
    .then( (res) => {

        const fileName = getFileName(uri) + Date.now();
        switch(res['content-type']){

            case Constants.CONTENT_TYPE_JPG: return [Constants.DOWNLOAD_PATH_JPG, fileName, 'jpg'];
            case Constants.CONTENT_TYPE_PNG: return [Constants.DOWNLOAD_PATH_PNG, fileName, 'png'];
            case Constants.CONTENT_TYPE_GIF: return [Constants.DOWNLOAD_PATH_GIF, fileName, 'gif'];
            default: throw Boom.create(400, 'Content type is not an image');
        }
    });
};

const download = (uri) => {

    return validate(uri)
    .then( ([filePath, fileName, type]) => {

        return new Promise( (resolve, reject) => {
            const writeStream = Fs.createWriteStream(filePath + fileName + '.' + type);
            Request(uri).pipe(writeStream);
            writeStream.on('close', () => {
                resolve([filePath, fileName, type]);
            });
            writeStream.on('error', (err) => {

                throw Boom.create(500, err.message);
            })
        })
    });
}

exports.downloadAndCompress = (uris) => {

    return uris.reduce( (chain, uri) => {

        return chain.then( () => {

            return download(uri)
            .then( ([filePath, fileName, type]) => {

                switch(type) {
                    case 'jpg': return Compress.compressJpg(filePath, fileName);
                    case 'png': return Compress.compressPng(filePath, fileName);
                    case 'gif': return Compress.compressGif(filePath, fileName);
                }
            });
        })
    }, Promise.resolve())
    .catch( (err) => {

        return Boom.create(400, err.message);
    });
}
