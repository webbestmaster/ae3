const getRoomById = require('./../other/room').getRoomById;
const mainConst = require('./../_main/const.json');

module.exports = {
    Room: {
        addConnection(data, ws) {
            const room = getRoomById(data.roomId);
            if (room) {
                room.addConnection(ws, data);
                return;
            }
            ws.send(JSON.stringify({id: mainConst.MESSAGE.FROM.BACK.ROOM_IS_NOT_EXISTS}));
        }
    }
};
