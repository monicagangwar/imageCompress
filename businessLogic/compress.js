'use strict';

const Fs = require('fs');
const Stream = require('stream');
const Constants = require('../helpers/constants');
const Jpegtran = require('jpegtran');

exports.compressJpeg = () => {

    return new Jpegtran(['-copy', 'none', '-optimize', '-progressive']);
};

exports.compressPng = (srcFilePath, srcFileName, writeStream) => {

    return srcFilePath;
};

exports.compressGif = (srcFilePath, srcFileName, writeStream) => {

    return srcFilePath;
};