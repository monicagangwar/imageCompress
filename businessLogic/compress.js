'use strict';

const Fs = require('fs');
const Stream = require('stream');
const Constants = require('../helpers/constants');
const Jpegtran = require('jpegtran');

exports.compressJpg = (srcFilePath, srcFileName) => {

    const srcFile = srcFilePath + srcFileName + '.jpg';
    const destFileName = srcFileName + '.compressed';
    const destFile = srcFilePath + destFileName + '.jpg';
    const compressor = new Jpegtran(['-copy', 'none', '-optimize', '-progressive']);
    const compressWriteStream = Fs.createWriteStream(destFile);

    Fs.createReadStream(srcFile).pipe(compressor).pipe(compressWriteStream);
    return Promise.all([compressWriteStream,destFile, destFileName , Constants.CONTENT_TYPE_JPG]);
};

exports.compressPng = (srcFilePath, srcFileName, writeStream) => {

    return srcFilePath;
};

exports.compressGif = (srcFilePath, srcFileName, writeStream) => {

    return srcFilePath;
};