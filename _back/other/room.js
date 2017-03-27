const BaseModel = require('./../core/base-model');
// const rooms = {};
const generateId = require('./../lib/internal/generate-id');

const roomConst = {

    connectionList: 'room_connection_list'

};

// TODO: add room destroy
class Room extends BaseModel {

    constructor(gameData) {

        super(gameData);

        const room = this;

        const id = generateId();

        room.set({id});

        // rooms[id] = room;

        room.set(roomConst.connectionList, []);

    }

}

// function getRoomById(gameId) {
//     return rooms[gameId]
// }
//
// function createRoom(data) {
//     return new Room(data);
// }

module.exports.Room = Room;
// module.exports.getRoomById = getRoomById;
// module.exports.createRoom = createRoom;
