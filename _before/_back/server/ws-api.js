const getRoomById = require('./../other/room').getRoomById;
const mainConst = require('./../../_front/www/_main/const.json');
const roomValidator = require('./../validator/room');

module.exports = {
    Room: {
        addConnection(data, ws) {
            const room = getRoomById(data.roomId);
            if (room && roomValidator.addConnection.isValid(data)) {
                room.addConnection(ws, data);
                return;
            }
            ws.send(JSON.stringify({id: mainConst.MESSAGE.FROM.BACK.ROOM_IS_NOT_EXISTS}));
        }
    }
};
