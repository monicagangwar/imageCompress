'use strict';

const Jpegtran = require('jpegtran');
const Optipng = require('optipng');

exports.compressJpeg = () => {

    return new Jpegtran(['-copy', 'none', '-optimize', '-progressive']);
};

exports.compressPng = () => {

    return new Optipng(['-o7', '-strip', 'all']);
};