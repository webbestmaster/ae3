const BaseModel = require('./../core/base-model');
const rooms = {};

const roomConst = {

    connectionList: 'connection_list'

};

class Room extends BaseModel {

    constructor(gameData) {

        super(gameData);

        const room = this;

        rooms[gameData.id] = room;

        room.set(roomConst.connectionList, []);

    }

    // addConnection

}

function getRoomById(gameId) {
    return rooms[gameId]
}

module.exports.Room = Room;
module.exports.getRoomById = getRoomById;
