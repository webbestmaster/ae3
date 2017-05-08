const getRoomById = require('./../../model/room.js').getRoomById;
const gpubiu = require('./../util.js').gpubiu;
const createError = require('./../util.js').createError;
const streamBodyParser = require('./../util.js').streamBodyParser;

module.exports.roomApiPost = (req, res, url, userId, roomId, methodName) => { // eslint-disable-line max-params
    streamBodyParser(req,
        body => {
            const params = JSON.parse(body);
            const room = getRoomById(roomId);

            res.setHeader('Content-Type', 'application/json');

            if (typeof room !== 'undefined' && typeof room[methodName] === 'function') {
                return room[methodName](req, res, gpubiu(userId), params);
            }

            return createError({}, res,
                ['Error: room has not method: ', gpubiu(userId), roomId, methodName, params].join(''));
        },
        evt => createError(evt, res, ['Can parse body', gpubiu(userId), roomId, methodName].join(''))
    );
};
