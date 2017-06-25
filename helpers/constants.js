'use strict';

const Constants = {
    UPLOAD_PATH: __dirname + '/../Utility/',
    JPG: {
        CONTENT_TYPE: 'image/jpg',
        DOWNLOAD_PATH: __dirname + '/../Utility/jpg',
        UPLOAD_PATH: __dirname + '/../Utility/jpg',
        EXTENSION: 'jpg'
    },
    JPEG: {
        CONTENT_TYPE: 'image/jpeg',
        DOWNLOAD_PATH: __dirname + '/../Utility/jpeg',
        UPLOAD_PATH: __dirname + '/../Utility/jpeg',
        EXTENSION: 'jpeg'
    },
    PNG: {
        CONTENT_TYPE: 'image/png',
        DOWNLOAD_PATH: __dirname + '/../Utility/png',
        UPLOAD_PATH: __dirname + '/../Utility/png',
        EXTENSION: 'png'
    },
    GIF: {
        CONTENT_TYPE: 'image/gif',
        DOWNLOAD_PATH: __dirname + '/../Utility/gif',
        UPLOAD_PATH: __dirname + '/../Utility/gif',
        EXTENSION: 'gif'
    },
    CSV: {
        CONTENT_TYPE: 'text/csv',
        DOWNLOAD_PATH: __dirname + '/../Utility',
        UPLOAD_PATH: __dirname + '/../Utility',
        EXTENSION: 'csv'
    },
    EXECUTABLE: {
        CONTENT_TYPE: 'application/octet-stream'
    }
}

module.exports = Constants;