const getRoomById = require('./../../model/room.js').getRoomById;
const gpubiu = require('./../util.js').gpubiu;
const createError = require('./../util.js').createError;

module.exports.roomApiGet = (req, res, url, userId, roomId, methodName, params) => { // eslint-disable-line max-params
    const room = getRoomById(roomId);

    res.setHeader('Content-Type', 'application/json');

    if (typeof room !== 'undefined' && typeof room[methodName] === 'function') {
        return room[methodName](req, res, gpubiu(userId), params);
    }

    return createError({}, res, ['Error: room has not method: ', gpubiu(userId), roomId, methodName, params].join(''));
};
