const getRoomById = require('./../other/room').getRoomById;


module.exports = {
    Room: {
        addConnection(data, ws) {
            const room = getRoomById(data.roomId);
            room.addConnection(ws, data);
        }
    }
};
