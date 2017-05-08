module.exports.gpubiu = require('./../../www/main/gpubui');

module.exports.createError = (evt, res, text) => {
    console.error({text, evt});
    Object.assign(res, {statusCode: 500});
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({error: text}));
};

module.exports.streamBodyParser = (request, success, error) => {
    let body = '';

    request.on('data', data => {
        body += data;
    });

    request.on('end', () => success(body));
    request.on('error', error);
    request.on('close', evt => console.warn('WARNING: request closed', evt));
};

module.exports.checkType = require('./../../www/js/util/check-type/index.js');
module.exports.mask = require('./../../www/js/util/mask/index.js');
